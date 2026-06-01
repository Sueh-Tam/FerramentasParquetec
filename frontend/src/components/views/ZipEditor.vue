<template>
  <button @click="goBack" class="back-btn">← Voltar</button>
  <div class="container">
    <h1>📦 Editor de Arquivo ZIP</h1>
    <div class="main-content">
      <div class="upload-section">
        <p class="subtitle">
          Selecione um arquivo ZIP, o script será injetado no
          <code>&lt;/body&gt;</code> do index.html
        </p>
        
        <div
          class="upload-area"
          @click="() => $refs.fileInput.click()"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
          :style="{ borderColor: isDragging ? '#38bdf8' : '#334155' }"
        >
          <div>📁 Clique aqui ou arraste um arquivo ZIP</div>
          <div class="upload-text">Suporta arquivos .zip</div>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept=".zip"
          @change="onFileSelected"
          style="display: none"
        />

        <div v-if="fileInfo" class="file-info" v-html="fileInfo"></div>

        <div v-show="isProcessing" class="progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }">
              {{ progress }}%
            </div>
          </div>
        </div>

        <div v-if="statusMessage" class="status">{{ statusMessage }}</div>

        <button @click="processZip" :disabled="!originalZip || isProcessing">
          Processar ZIP
        </button>

        <button
          v-if="modifiedZipBlob"
          @click="downloadZip"
          style="margin-left: 10px"
        >
          Baixar ZIP Modificado
        </button>
      </div>

      <div class="logs-section">
        <div class="logs-header">
          <h3>📋 Log de Atividades</h3>
          <button class="clear-logs-btn" @click="clearLogs">Limpar Logs</button>
        </div>

        <div class="logs-container" ref="logsContainer">
          <div
            v-for="(log, index) in logs"
            :key="index"
            :class="['log-entry', 'log-' + log.type]"
          >
            <div class="log-timestamp">🕐 {{ log.timestamp }}</div>
            <div class="log-message">{{ log.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Script to inject
const scriptToInject =
  '\n<scr' +
  'ipt>\n document.addEventListener(\'click\', function(event) {\n let link = event.target.closest(\'a\');\n if (link && link.href &&\nlink.href.includes(\'eadnovo.itaipuparquetec.org.br\')) {\n event.preventDefault();\n window.top.location.href = link.href;\n }\n });\n</scr' +
  'ipt>'

// Refs
const fileInput = ref(null)
const logsContainer = ref(null)

// State
const originalZip = ref(null)
const modifiedZipBlob = ref(null)
const fileName = ref('')
const fileInfo = ref('')
const progress = ref(0)
const isProcessing = ref(false)
const statusMessage = ref('')
const isDragging = ref(false)
const logs = ref([
  {
    type: 'info',
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    message: 'Aguardando ação do usuário...'
  }
])

// Methods
function goBack() {
  router.push('/')
}

function addLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('pt-BR')
  logs.value.push({ type, timestamp, message })
  
  nextTick(() => {
    if (logsContainer.value) {
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight
    }
  })
}

function clearLogs() {
  logs.value = []
  addLog('Logs limpos!', 'info')
  addLog('Aguardando ação do usuário...', 'info')
}

function showStatus(message) {
  statusMessage.value = message
  setTimeout(() => {
    statusMessage.value = ''
  }, 5000)
}

function updateProgress(percent, text) {
  progress.value = percent
}

async function editIndexHtml(zip) {
  addLog('🔍 Procurando index.html...', 'processing')

  const files = Object.keys(zip.files)
  let indexFile = null

  for (let i = 0; i < files.length; i++) {
    const f = files[i]
    if (
      f.toLowerCase() === 'index.html' ||
      f.toLowerCase().endsWith('/index.html')
    ) {
      indexFile = f
      break
    }
  }

  if (!indexFile) {
    addLog('❌ index.html não encontrado!', 'error')
    throw new Error('Arquivo index.html não encontrado!')
  }

  addLog('✅ index.html encontrado!', 'success')

  const content = await zip.file(indexFile).async('string')

  if (content.indexOf('eadnovo.itaipuparquetec.org.br') !== -1) {
    addLog('⚠️ Script já existe no arquivo.', 'warning')
    return zip
  }

  const bodyCloseIndex = content.lastIndexOf('</body>')
  let newContent

  if (bodyCloseIndex !== -1) {
    newContent =
      content.slice(0, bodyCloseIndex) +
      scriptToInject +
      content.slice(bodyCloseIndex)
  } else {
    newContent = content + scriptToInject
  }

  zip.file(indexFile, newContent)
  addLog('💾 Script injetado com sucesso!', 'success')

  return zip
}

async function processZip() {
  if (!originalZip.value) return

  isProcessing.value = true

  try {
    updateProgress(10, 'Lendo ZIP...')
    const zip = await window.JSZip.loadAsync(originalZip.value)

    updateProgress(40, 'Editando index.html...')
    const modifiedZip = await editIndexHtml(zip)

    updateProgress(70, 'Gerando ZIP...')
    const newZipBlob = await modifiedZip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE'
    })

    updateProgress(100, 'Completo!')
    modifiedZipBlob.value = newZipBlob

    showStatus('✅ ZIP processado com sucesso!')
    addLog('🎉 Processo concluído!', 'success')
  } catch (error) {
    addLog('❌ ' + error.message, 'error')
  } finally {
    isProcessing.value = false
  }
}

function onFileSelected(e) {
  const file = e.target.files[0]

  if (!file) return

  if (!file.name.toLowerCase().endsWith('.zip')) {
    addLog('❌ Arquivo inválido!', 'error')
    return
  }

  fileName.value = file.name.replace('.zip', '_modificado.zip')
  originalZip.value = file
  fileInfo.value =
    '<strong>Arquivo:</strong> ' +
    file.name +
    '<br>' +
    '<strong>Tamanho:</strong> ' +
    (file.size / 1024).toFixed(2) +
    ' KB'

  addLog('📁 ZIP carregado com sucesso!', 'upload')
}

function onDragOver(e) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave(e) {
  e.preventDefault()
  isDragging.value = false
}

function onDrop(e) {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (!file.name.toLowerCase().endsWith('.zip')) {
      addLog('❌ Arquivo inválido!', 'error')
      return
    }
    
    fileName.value = file.name.replace('.zip', '_modificado.zip')
    originalZip.value = file
    fileInfo.value =
      '<strong>Arquivo:</strong> ' +
      file.name +
      '<br>' +
      '<strong>Tamanho:</strong> ' +
      (file.size / 1024).toFixed(2) +
      ' KB'

    addLog('📁 ZIP carregado com sucesso!', 'upload')
  }
}

function downloadZip() {
  if (!modifiedZipBlob.value) return

  const url = URL.createObjectURL(modifiedZipBlob.value)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName.value
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  addLog('📥 Download iniciado!', 'success')
}

onMounted(() => {
  addLog('🟢 Sistema pronto!', 'success')
  addLog('💡 Arraste um ZIP ou clique na área de upload.', 'info')
})
</script>