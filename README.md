# FerramentasParquetec

Hub de ferramentas web desenvolvido em Vue 3 para centralizar pequenas automações e utilidades executadas diretamente no navegador.

Atualmente o projeto é composto apenas por frontend e utiliza Docker exclusivamente para o ambiente de desenvolvimento.

## Tecnologias

* Vue 3
* Vite
* JavaScript
* Docker
* Docker Compose

## Privacidade

As ferramentas são projetadas para executar o processamento localmente no navegador do usuário.

O projeto:

* Não coleta dados pessoais.
* Não utiliza cookies.
* Não utiliza serviços de rastreamento.
* Não compartilha informações com terceiros.
* Não armazena arquivos processados pelos usuários.

## Pré-requisitos

Instalar:

* Docker
* Docker Compose Plugin

Verificar instalação:

```bash
docker --version
docker compose version
```

## Estrutura do Projeto

```text
FerramentasParquetec/
│
├── docker-compose.yml
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   └── public/
│
└── README.md
```

## Primeira Execução

Na raiz do projeto execute:

```bash
docker compose up -d --build
```

O Docker irá:

* Baixar a imagem Node.js 22.
* Instalar as dependências definidas no `package.json`.
* Criar o ambiente de desenvolvimento do Vue.
* Disponibilizar a aplicação na porta 5173.

## Acessando a Aplicação

Após a inicialização:

```text
http://localhost:5173
```

## Comandos Úteis

Subir o ambiente:

```bash
docker compose up -d
```

Subir reconstruindo a imagem:

```bash
docker compose up -d --build
```

Visualizar logs:

```bash
docker compose logs -f
```

Parar o ambiente:

```bash
docker compose down
```

Abrir terminal dentro do container:

```bash
docker compose exec frontend bash
```

Instalar uma nova dependência:

```bash
docker compose exec frontend npm install nome-da-biblioteca
```

Exemplo:

```bash
docker compose exec frontend npm install jszip
```

## Dependências Instaladas no Container

A imagem Docker é baseada em:

* Node.js 22
* npm

As dependências da aplicação são instaladas automaticamente a partir do arquivo:

```text
frontend/package.json
```

## Desenvolvimento

As alterações realizadas nos arquivos do projeto são refletidas automaticamente na aplicação através do volume compartilhado entre o host e o container.

Caso ocorra erro de permissão no WSL:

```bash
sudo chown -R $USER:$USER .
```
