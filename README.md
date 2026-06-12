# Sistema de Reservas de Mesa

Projeto desenvolvido para a Prova 2 da disciplina de Desenvolvimento Web III.

A aplicação permite gerenciar reservas de mesas em um restaurante, utilizando TypeScript, Express, MongoDB e Mongoose no backend, além de um frontend simples com HTML, CSS e JavaScript.

## Autores

Projeto desenvolvido para fins acadêmicos na disciplina de Desenvolvimento Web III.

| Nome | GitHub |
|---|---|
| Nicolas Kaue | [@nickdsm24](https://github.com/nickdsm24) |
| Bruna Gomes | [@brunagomess26](https://github.com/brunagomess26) |

## Funcionalidades

### Reservas

- Criar uma nova reserva.
- Listar reservas cadastradas.
- Filtrar reservas por cliente, mesa, data ou status.
- Atualizar informações de uma reserva existente.
- Cancelar uma reserva.
- Validar disponibilidade da mesa no horário solicitado.
- Validar se a mesa comporta a quantidade de pessoas.
- Definir duração padrão da reserva em 1h30.
- Impedir reservas com menos de 1 hora de antecedência.
- Atualizar o status da reserva conforme o horário.

### Mesas

- Cadastrar mesas.
- Listar mesas cadastradas.
- Buscar mesa por ID.
- Atualizar dados de uma mesa.
- Remover mesa.

### Mapa Visual das Mesas

O sistema possui uma representação visual das mesas com cores indicando o status:

- Verde: disponível.
- Amarelo: reservado.
- Vermelho: ocupado.

Ao clicar em uma mesa, ela é selecionada no formulário de reserva.

## Tecnologias Utilizadas

- TypeScript
- Node.js
- Express
- MongoDB
- Mongoose
- HTML
- CSS
- JavaScript

## Estrutura do Projeto

```txt
p2-DW3/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── src/
│   ├── controllers/
│   │   ├── mesa.controller.ts
│   │   └── reserva.controller.ts
│   ├── models/
│   │   ├── mesaSchema.ts
│   │   └── reservaSchema.ts
│   ├── routes/
│   │   ├── mesa.routes.ts
│   │   └── reserva.routes.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
````

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js
* npm
* MongoDB local ou MongoDB via Docker

## Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do projeto:

```bash
cd p2-DW3
```

Instale as dependências:

```bash
npm install
```

## Executando o MongoDB

### MongoDB instalado localmente

Caso o MongoDB esteja instalado no Windows, inicie o serviço:

```bash
net start MongoDB
```

## Executando o Projeto

Para rodar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

O sistema ficará disponível em:

```txt
http://localhost:3000
```

## Banco de Dados

O projeto utiliza o banco:

```txt
reserva
```

String de conexão utilizada:

```txt
mongodb://127.0.0.1:27017/reserva
```

O banco será criado automaticamente quando o primeiro dado for salvo.

## Rotas da API

### Mesas

#### Criar mesa

```http
POST /mesas
```

Exemplo de corpo da requisição:

```json
{
  "numMesa": 1,
  "capacidade": 4,
  "loc": "Salão"
}
```

#### Listar mesas

```http
GET /mesas
```

#### Buscar mesa por ID

```http
GET /mesas/:id
```

#### Atualizar mesa

```http
PUT /mesas/:id
```

#### Remover mesa

```http
DELETE /mesas/:id
```

---

### Reservas

#### Criar reserva

```http
POST /reservas
```

Exemplo de corpo da requisição:

```json
{
  "nomeCliente": "Nicolas",
  "telefoneCliente": "12999999999",
  "mesa": "ID_DA_MESA",
  "quantPessoa": 4,
  "horaInicio": "2026-06-12T22:00:00.000Z",
  "obs": "Mesa próxima à janela"
}
```

#### Listar reservas

```http
GET /reservas
```

#### Filtrar reservas

Por cliente:

```http
GET /reservas?cliente=Nicolas
```

Por mesa:

```http
GET /reservas?mesa=ID_DA_MESA
```

Por status:

```http
GET /reservas?status=Reservado
```

Por data:

```http
GET /reservas?data=2026-06-12
```

Também é possível combinar filtros:

```http
GET /reservas?status=Reservado&data=2026-06-12
```

#### Buscar reserva por ID

```http
GET /reservas/:id
```

#### Atualizar reserva

```http
PUT /reservas/:id
```

#### Cancelar reserva

```http
PATCH /reservas/:id/cancelar
```

#### Remover reserva

```http
DELETE /reservas/:id
```

## Regras de Negócio Implementadas

* Não é permitido cadastrar duas reservas para a mesma mesa no mesmo horário.
* Toda reserva possui horário inicial e duração padrão de 90 minutos.
* Reservas devem ser feitas com pelo menos 1 hora de antecedência.
* O status da reserva pode ser:
  * Reservado
  * Ocupado
  * Finalizado
  * Cancelado
* O sistema valida se a mesa comporta a quantidade de pessoas informada.
* O status da reserva é atualizado conforme o horário atual.
* Reservas canceladas não bloqueiam novas reservas no mesmo horário.

## Status das Mesas no Frontend

No mapa visual:

* Mesa verde: disponível.
* Mesa amarela: possui reserva agendada.
* Mesa vermelha: está ocupada no momento.

## Logs

O sistema registra logs básicos no terminal para operações como:

* Criação de mesa.
* Atualização de mesa.
* Remoção de mesa.
* Criação de reserva.
* Atualização de reserva.
* Cancelamento de reserva.
* Remoção de reserva.

## Scripts Disponíveis

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build:

```bash
npm run build
```

Rodar versão compilada:

```bash
npm start
```
