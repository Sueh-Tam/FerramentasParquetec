<script setup>
    import { useRouter } from 'vue-router'
    
    const router = useRouter()
</script>
<template>
    <header>
        <h1>Central de Ferramentas</h1>
        <p>Gerencie e acesse rapidamente todas as funcionalidades do sistema.</p>
    </header>
    <main class="container">
        <div class="card">
            <h2>ZipEditor Articulate</h2>

            <p>
                Área utilizada para adicionar conteúdo ao arquivo index.html.
            </p>

            <button @click="router.push('/zip-editor')" class="btn">
                Acessar
            </button>
        </div>
    </main>
</template>
