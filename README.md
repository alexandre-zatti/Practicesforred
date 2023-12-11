# Projeto Practicesforred

## 📘 Tutorial de Instalação e Execução do Projeto

Este guia provem os passos necessarios para executar a aplicacao usando Docker de maneira local em sua máquina.

### 📦 Instalação do Docker Desktop para Windows

1. **Baixe o Docker Desktop**: Visite o [Docker Hub](https://www.docker.com/products/docker-desktop) e baixe o Docker Desktop para Windows.
2. **Instale o Docker Desktop**: Execute o arquivo de instalação e siga as instruções.
3. **Execute o Docker Desktop**: Após a instalação, abra o Docker Desktop. Pode ser necessário fazer login ou criar uma conta Docker.

### 🛠 Configuração do Docker

1. **Verifique a Instalação**: Abra o terminal de comando e digite `docker --version` para verificar se o Docker foi instalado corretamente.
2. **Aumente os Recursos (Opcional)**: No Docker Desktop, você pode alocar quantidades específicas de CPU, memória e espaço em disco. Para ajustar, clique com o botão direito no ícone do Docker na bandeja do sistema, escolha "Configurações" e ajuste em "Recursos".

### 🌐 Instalação do Git

1. **Baixe o Git**: Acesse o [site do Git](https://git-scm.com/download/win) e baixe a versão mais recente.
2. **Instale o Git**: Execute o instalador e siga as etapas. Aceite as configurações padrão, a menos que você tenha uma preferência específica.
3. **Verifique a Instalação do Git**: Abra o terminal de comando e digite `git --version` para garantir que o GIT está instalado corretamente.

### 📂 Clonar o Repositório do Projeto

1. **Clone o Repositório**: Use o prompt de comando para navegar até a pasta onde deseja o projeto (usando `cd caminho_para_a_pasta`). Em seguida, clone o repositório usando `git clone [url_do_repositório]`. Substitua `[url_do_repositório]` pela URL do repositório desse projeto.

### 🚀 Executar o Arquivo Docker Compose

1. **Navegue até a Pasta do Projeto**: No prompt de comando, navegue até o diretório onde você clonou o projeto.
2. **Execute o Docker Compose**: Digite `docker-compose up` e pressione Enter. Este comando iniciará a construção e execução dos contêineres conforme definido no arquivo `docker-compose.yml`.

### 🌐 Acessar a Aplicação

1. **Abra um Navegador Web**: Uma vez que os contêineres do Docker estiverem funcionando, abra um navegador web.
2. **Acesse o Frontend**: Navegue até `http://localhost:3000`. Isso deve carregar o frontend da aplicação.

### 🔻 Encerrar

1. **Pare os Contêineres**: Quando terminar, volte ao prompt de comando e pressione `Ctrl + C` para parar os contêineres.
2. **Remova os Contêineres**: Opcionalmente, você pode remover os contêineres executando `docker-compose down`.
