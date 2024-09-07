/**
* A função pesquisar(de,ate) tem como objetivo realizar uma busca em um banco de dados IndexedDB, 
* filtrando os registros por um intervalo de valores e exibindo os resultados em uma tabela HTML.
* 
* Parâmetros:
   de: Limite inferior do intervalo de pesquisa.
   ate: Limite superior do intervalo de pesquisa.

   Funcionamento:

     1. Criação da Tabela:
        Cria uma nova tabela HTML com as colunas "Título", "Valor", "Excluir" e "Editar".
        Define o estilo das células e linhas da tabela.
     2. Abertura do Banco de Dados:
        Abre o banco de dados IndexedDB "dbContas" na versão 3.
        Criar o Objeto Store (se necessário): Se o objeto store "tbDespesas" não existir, ele é criado 
        com os seguintes índices:
           id: Chave primária auto-incrementada.
           titulo: Índice não único para buscar por título.
           valor: Índice não único para buscar por valor.
     3. Início da Transação:
        Inicia uma transação em modo de leitura/escrita no objeto store "tbDespesas".
     4. Definição do Filtro:
        Cria um objeto IDBKeyRange para definir o intervalo de pesquisa com base nos parâmetros "de" e 
        "ate".
     5. Abertura do Cursor:
        Abre um cursor no índice "valor" para buscar os registros que se encaixam no intervalo definido.
     6. Iteração e Exibição dos Resultados:
        Para cada registro encontrado pelo cursor:
           Cria uma nova linha na tabela.
           Preenche as células da linha com os dados do registro (título, valor).
           Cria botões "Editar" e "Excluir" e adiciona eventos de clique para cada um.
           Adiciona a linha à tabela.
     7. Exibição da Tabela:
        Após iterar por todos os registros, a tabela completa é adicionada ao elemento HTML com o 
        ID "resultados-pesquisa".
*/
function pesquisar(de,ate) {
    /* Cria uma nova tabela HTML para exibir os resultados da pesquisa.*/
    const tabela = document.createElement('table');
    const linhaCabecalho = document.createElement('tr');
    const celulaCabecalho1 = document.createElement('th');
    celulaCabecalho1.textContent = 'Id';
    const celulaCabecalho2 = document.createElement('th');
    celulaCabecalho2.textContent = 'Título';
    celulaCabecalho2.setAttribute("align","left");
    const celulaCabecalho3 = document.createElement('th');
    celulaCabecalho3.textContent = 'Valor';
    const celulaCabecalho4 = document.createElement('th');
    celulaCabecalho4.textContent = 'Transação';
    //linhaCabecalho.appendChild(celulaCabecalho1);
    linhaCabecalho.appendChild(celulaCabecalho2);
    linhaCabecalho.appendChild(celulaCabecalho3);
    linhaCabecalho.appendChild(celulaCabecalho4);
    linhaCabecalho.setAttribute("class","item-resultado h2");
    
    /* Adiciona uma linha de cabeçalho com as colunas "Id", "Título", "Valor" e "Transação". 
       E Define o estilo das células e linhas da tabela.
    */ 
    tabela.appendChild(linhaCabecalho);
    tabela.setAttribute("class","item-resultado");
    
    /* Abre o banco de dados IndexedDB "dbContas" na versão 3   */
    const dbContas = window.indexedDB.open("dbContas", 3);
    /**
     * onupgradeneeded: Se o banco de dados não existir ou a versão for diferente, cria um novo objeto store 
     * chamado "tbDespesas" com os seguintes índices:
     * id: Chave primária auto-incrementada.
     * titulo: Índice não único para buscar por título.
     */
    dbContas.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Cria um object store se não existir
        if (!db.objectStoreNames.contains("tbDespesas")) { 
            const tbDespesas = db.createObjectStore("tbDespesas", { keyPath: "id", autoIncrement: true });
            tbDespesas.createIndex("titulo", "titulo", { unique: false });
            tbDespesas.createIndex("valor", "valor", { unique: false });
        }
    };
    /**
     * onsuccess: Quando a conexão com o banco de dados é estabelecida, inicia uma transação 
     * em modo de leitura/escrita no objeto store "tbDespesas".
     */
    dbContas.onsuccess = (event) => {
        var pelomenosum = 0;
        const db = event.target.result;
        const transaction = db.transaction("tbDespesas", "readwrite");
        const tbLista = transaction.objectStore("tbDespesas");
        // faixa: Define um intervalo de pesquisa para limitar os resultados.
        
        const filtro = IDBKeyRange.bound(de, ate);
        /**
         * Abre um cursor no índice "titulo" para buscar os registros que correspondem ao 
         * termo de pesquisa (que não está explicitamente definido no código fornecido, 
         * presumindo-se que seja obtido de algum campo de entrada).
         */
        const cursorRequest = tbLista.index("titulo").openCursor(filtro);
            
            /* 
        cursorRequest.onsuccess: Para cada registro encontrado pelo cursor
        Cria uma nova linha na tabela,Preenche as células da linha com os 
        dados do registro (id, título, valor),Cria botões "Editar" e "Excluir"
        adicionando os eventos de clique para cada um. E Adiciona a linha à tabela. 
        */
        cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    // Creia a linha e celulas da tabela de resultados 
                    const linhaDados = document.createElement('tr');
                    const celulaDados1 = document.createElement('td');
                    celulaDados1.textContent = cursor.value.id;
                    const celulaDados2 = document.createElement('td');
                    // Preenche a célula co o título do registro lido
                    celulaDados2.textContent = cursor.value.titulo;
                    celulaDados2.setAttribute("class","descricao-meta");
                    const celulaDados3 = document.createElement('td');
                    // Preenche a célula co o título do registro lido
                    celulaDados3.textContent = cursor.value.valor;
                    celulaDados3.setAttribute("align","right");
                    
                    // Criar o botão editar
                    var botaoEditar = document.createElement("button");
                    botaoEditar.textContent = "Editar";
                    botaoEditar.setAttribute('id', cursor.value.id);
                // Adiciona evento onclick
                    botaoEditar.onclick = function(event) {
                        cadastrar(event);
                    };
                    // Criar o botão excluir
                    var botaoExcluir = document.createElement("button");
                    botaoExcluir.textContent = "Excluir";
                    botaoExcluir.setAttribute('id', cursor.value.id);
                // Adiciona evento onclick
                    botaoExcluir.onclick = function(event) {
                        excluir(event);
                    };
                    // Adicionar os botões ao documento
                    const celulaDados4 = document.createElement('td');
                    celulaDados4.appendChild(botaoExcluir);
                    const celulaDados5 = document.createElement('td');
                    celulaDados5.appendChild(botaoEditar);
                    
                    //linhaDados.appendChild(celulaDados1);
                    linhaDados.appendChild(celulaDados2);
                    linhaDados.appendChild(celulaDados3);
                    linhaDados.appendChild(celulaDados4);
                    linhaDados.appendChild(celulaDados5);
                    // Adiciona a linha à tabela.
                    tabela.appendChild(linhaDados);
                    pelomenosum = 1;
                    cursor.continue();
                } else {
                    //Após iterar por todos os registros, a tabela é adicionada ao DOM.
                    document.getElementById("resultados-pesquisa").innerHTML="";
                    if(pelomenosum == 1){
                        document.getElementById("resultados-pesquisa").appendChild(tabela);
                    }else{
                        const paragrafo = document.createElement('p');
                        paragrafo.textContent = "Nada encontradao na pesquisa";
                        document.getElementById("resultados-pesquisa").appendChild(paragrafo);
                    }
                }    
        }
    }
}
    /**
     * A função cadastrar(event) é responsável por criar um formulário para inserir ou atualizar
     * um registro no banco de dados IndexedDB "dbContas". A interface do formulário é dinâmica, 
     * adaptando-se de acordo com o botão clicado:
     * Botão "cadastrar": Exibe um formulário vazio para inserir de um novo registro.
     * Botão "Editar": Recupera o registro correspondente ao ID do botão clicado, preenche
     * o formulário com os dados existentes e atualiza o texto do botão para "Atualizar".
     * Parâmetros:
     *     event: Objeto do evento que disparou a função.
     
   Comportamento:

      1. Identifica o Botão Clicado:
         Obtém o ID do botão clicado a partir do objeto event.
      2. Cria o Formulário:
         Cria um elemento form para abrigar os campos do formulário.
         Cria labels e inputs para os campos "Título" e "Valor".
         Seta atributos como id, type, required, e placeholder para os inputs.
         Cria um botão "Salvar".
      3. Preenchimento do Formulário (opcional):
         Se o botão clicado não for "cadastrar" (ou seja, é um botão "Editar"):
            Abre o banco de dados IndexedDB.
            Inicia uma transação de leitura/escrita no object store "tbDespesas".
            Recupera o registro com o ID obtido do botão clicado.
            Preenche os campos do formulário com os dados do registro recuperado.
            Seta o atributo id do botão "Salvar" com o ID do registro recuperado.
      4. Configura o Botão "Salvar":
         Define o texto do botão "Salvar" de acordo com o botão clicado ("Adicionar" para cadastrar, 
         "Atualizar" para editar).
      5. Adiciona um evento onclick ao botão "Salvar":
         Se for "Adicionar", chama a função insert(event) para cadastrar um novo registro.
         Se for "Atualizar", chama a função update(event) para atualizar o registro existente.
      6. Exibe o Formulário:
         Limpa o conteúdo do elemento com ID "resultados-pesquisa" (presumivelmente onde a tabela de resultados é exibida).
         Adiciona o formulário criado ao elemento com ID "resultados-pesquisa".    
    */

function cadastrar(event){
    //Obtém o ID do botão clicado a partir do objeto event
    var idBotao = event.target.id;
    //Cria um elemento form para abrigar os campos do formulário.
    const formulario = document.createElement('form');
    //Cria labels e inputs para os campos "Título" e "Valor".
    const labeltitulo = document.createElement('label'); 
    labeltitulo.textContent = 'Título'; 
    labeltitulo.setAttribute('for','titulo'); 
    const titulo = document.createElement('input');
    //Seta atributos como id, type, required, e placeholder para os inputs.    
    titulo.setAttribute('id','titulo');
    titulo.setAttribute('type','text');
    titulo.setAttribute('required','requerid');
    titulo.setAttribute('aria-labelledby','titulo');
    const labelvalor = document.createElement('label'); 
    labelvalor.textContent = 'Valor'; 
    labelvalor.setAttribute('for','valor'); 
    const valor = document.createElement('input');
    valor.setAttribute('id','valor');
    valor.setAttribute('type','number');
    valor.setAttribute('required','requerid');
    valor.setAttribute('aria-labelledby','valor');
    //Cria um botão "Salvar"
    const botaoSalvar = document.createElement('button');
    
    /* Se o botão clicado não for "cadastrar" (ou seja, é um botão "Editar"):
    *  Abre o banco de dados IndexedDB.
    *  Inicia uma transação de leitura/escrita no object store "tbDespesas".
    *  Recupera o registro com o ID obtido do botão clicado.
    *  Preenche os campos do formulário com os dados do registro recuperado.
    *  Seta o atributo id do botão "Salvar" com o ID do registro recuperado.
    */
    if(idBotao != "cadastrar"){
        // Abrir o banco de dados
        var id=parseInt(event.target.id);
        // Abrir o banco de dados
        var request = window.indexedDB.open("dbContas", 3);
        //request.onsuccess:  
        request.onsuccess = function(event) {
            // Iniciar uma transação em modo de escrita
            var db = event.target.result;
            var transaction = db.transaction(["tbDespesas"], "readwrite");
            var objectStore = transaction.objectStore("tbDespesas");
            // Obter o objeto com a chave informada
            var getRequest = objectStore.get(id);
            // preenche os campos do formulário e assinala o id do pontao Salvar
            getRequest.onsuccess = function(event) {
                titulo.value=event.target.result.titulo;
                valor.value=event.target.result.valor;
                botaoSalvar.setAttribute("id",event.target.result.id);
            };
        };
    }else{
        titulo.setAttribute('placeholder','Digite o título da conta');
        valor.setAttribute('placeholder','Digite o valor da conta [-]999.99');
    }
    /* Define o texto do botão "Salvar" de acordo com o botão clicado:
    *    "Adicionar" para cadastrar ou 
    *    "Atualizar" para editar
    *  E adiciona o evento onclick correspondente:
    *  Se for "Adicionar", chama a função insert(event) para cadastrar um novo registro.
    *  Se for "Atualizar", chama a função update(event) para atualizar o registro existente. 
    */
    if(idBotao=="cadastrar"){
        botaoSalvar.textContent = "Adicionar";
        botaoSalvar.onclick = function(event) {
            insert(event);
        }
    }else{
        botaoSalvar.textContent = "Atualizar";
        botaoSalvar.onclick = function(event) {
            update(event);
        }
    };
    // adiciona elementos ao formulário 
    formulario.appendChild(labeltitulo);
    formulario.appendChild(titulo);
    formulario.appendChild(labelvalor);
    formulario.appendChild(valor);
    formulario.appendChild(botaoSalvar);
    /**
     * substitue o conteúdo do elemento "resultados-pesquisa" 
     * e pelo formulário criado dinamicamente.
     */
    document.getElementById("resultados-pesquisa").innerHTML="";
    document.getElementById("resultados-pesquisa").appendChild(formulario);
} 

/**
 * A função excluir(event) tem como objetivo remover um registro específico do banco de dados 
 * IndexedDB "dbContas". Essa ação é geralmente iniciada quando o usuário clica em um botão 
 * "Excluir" associado a um registro na interface do usuário.
 * 
 *  Parâmetros:
 *     event: Um objeto de evento que contém informações sobre o evento que disparou a função, 
 *     como o elemento que foi clicado.

Funcionamento:

  1. Obtém o ID do Registro:
     Extrai o ID do registro a ser excluído do atributo id do elemento que disparou o evento 
     (provavelmente um botão).
  2. Abre o Banco de Dados:
     Abre o banco de dados IndexedDB com o nome "dbContas" na versão 3.
  3. Inicia uma Transação:
     Inicia uma transação em modo de escrita no objeto store "tbDespesas", onde os dados estão 
     armazenados.
  4. Exclui o Registro:
     Utiliza o método delete() do objeto store para excluir o registro com o ID especificado.
  5. Gerencia o Resultado:
        onsuccess: Se a exclusão for bem-sucedida, exibe uma mensagem no console indicando que o 
                   objeto foi deletado com sucesso.
        onerror: Se ocorrer algum erro durante a exclusão, exibe uma mensagem de erro no console com 
        detalhes sobre o erro.
*/
function excluir(event) {
    // Obtém o ID do registro a ser excluído a partir do botão clicado
    var id = parseInt(event.target.id);
  
    // Abre o banco de dados IndexedDB
    var request = window.indexedDB.open("dbContas", 3);
  
    request.onsuccess = function(event) {
      var db = event.target.result; // Obtém uma referência para o banco de dados
  
      // Inicia uma transação em modo de escrita no objeto store "tbDespesas"
      var transaction = db.transaction(["tbDespesas"], "readwrite");
      var objectStore = transaction.objectStore("tbDespesas");
  
      // Exclui o registro com o ID especificado
      var deleteRequest = objectStore.delete(id);
  
      deleteRequest.onsuccess = function(event) {
        alert(`Objeto com a chave ${id} deletado com sucesso`);
        document.getElementById("pesquisar").click();
      };
  
      deleteRequest.onerror = function(event) {
        console.error("Erro ao deletar o objeto:", event.target.error);
      };
    };
 }
 /**
  * A função insert(event) tem como objetivo inserir um novo registro em um banco de dados IndexedDB. 
  * Especificamente, ela captura os dados de um formulário (título e valor), cria um objeto com esses 
  * dados e insere esse objeto ao objeto store "tbDespesas" do banco de dados "dbContas".
  *
  * Parâmetros:
  *    event: Um objeto de evento que é passado automaticamente para a função quando um evento 
  *    ocorre. O principal uso aqui é para prevenir o comportamento padrão do envio do 
  *    formulário, que seria recarregar a página.  
 
Funcionamento:

  1. Prevenção do Envio do Formulário:
     A linha event.preventDefault(); impede que o formulário seja enviado de forma padrão, o que 
     causaria o recarregamento da página. Isso é crucial para que a inserção dos dados no banco de 
     dados seja realizada sem interromper a experiência do usuário.
  2. Captura dos Dados do Formulário:
     Os valores dos campos "titulo" e "valor" são obtidos dos elementos HTML correspondentes usando 
     document.getElementById(). O valor do campo "valor" é convertido para um número inteiro usando 
     parseInt().
  3. Abertura do Banco de Dados:
     Abre o banco de dados IndexedDB com o nome "dbContas" na versão 3.
  4. Iniciação de uma Transação:
     Inicia uma transação em modo de escrita no objeto store "tbDespesas". Isso permite que você 
     modifique os dados no banco de dados.
  5. Criação do Objeto a Ser Inserido:
     Cria um objeto JavaScript com as propriedades "titulo" e "valor", atribuindo os valores obtidos 
     do formulário.
  6. Adição do Objeto ao Banco de Dados:
     Utiliza o método add() do objeto store para adicionar o objeto criado ao banco de dados.
  7. Gerenciamento de Resultados:
        onsuccess: Se a inserção for bem-sucedida, exibe uma mensagem no console indicando que a 
                   conta foi inserida com sucesso.
        onerror: Se ocorrer algum erro durante a inserção, exibe uma mensagem de erro no console com 
                 detalhes sobre o erro. 
 * */
function insert(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
  
    // Obtém os valores dos campos do formulário
    var titulo = document.getElementById('titulo').value;
    var valor = parseInt(document.getElementById('valor').value);
  
    // Abre o banco de dados
    var request = window.indexedDB.open("dbContas", 3);
  
    request.onsuccess = function(event) {
      var db = event.target.result; // Obtém uma referência para o banco de dados
  
      // Inicia uma transação em modo de escrita
      var transaction = db.transaction(["tbDespesas"], "readwrite");
      var objectStore = transaction.objectStore("tbDespesas");
  
      // Cria um objeto a ser inserido
      var conta = { titulo: titulo, valor: valor };
  
      // Adiciona o objeto ao banco de dados
      var request = objectStore.add(conta);
  
      request.onsuccess = function(event) {
        alert("Conta inserida com sucesso");
        document.getElementById("pesquisar").click();
      };
  
      request.onerror = function(event) {
        console.error("Erro ao inserir conta:", event.target.error);
      };
    };
 }
 /**
  * 
  * A função update(event) é responsável por atualizar um registro existente no banco de dados IndexedDB.
  * Ela busca o registro a ser atualizado com base no ID fornecido, modifica os seus valores e salva as
  * alterações no banco de dados.
  * 
  *  Parâmetros:
  *     event: Um objeto de evento que é passado automaticamente para a função quando um evento ocorre.
  *     O principal uso aqui é para prevenir o comportamento padrão do envio do formulário.
 
 Funcionamento:

   1. Prevenção do Envio do Formulário:
      event.preventDefault(); impede que o formulário seja enviado de forma padrão, o que causaria o
      recarregamento da página.
   2. Obtenção do ID do Registro:
      Extrai o ID do registro a ser atualizado do atributo id do elemento que disparou o evento 
      (provavelmente um botão).
   3. Abertura do Banco de Dados:
      Abre o banco de dados IndexedDB com o nome "dbContas" na versão 3.
   4. Iniciação de uma Transação:
      Inicia uma transação em modo de escrita no objeto store "tbDespesas".
   5. Busca do Registro:
      Utiliza o método get() do objeto store para buscar o registro com o ID especificado.
   6. Atualização do Registro:
      Atualiza as propriedades titulo e valor do objeto recuperado com os novos valores obtidos do 
      formulário.
   7. Salvamento das Alterações:
      Utiliza o método put() do objeto store para salvar as alterações no banco de dados. O método 
      put tanto insere quanto atualiza registros, dependendo se a chave já existe ou não.
   8. Gerenciamento de Resultados:
        onsuccess: Se a atualização for bem-sucedida, exibe uma mensagem no console indicando que a 
                   conta foi atualizada com sucesso.
        onerror:   Se ocorrer algum erro durante a atualização, exibe uma mensagem de erro no console 
                   com detalhes sobre o erro.
 
 */
    
 function update(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
  
    // Obtém o ID do registro a ser atualizado
    var id = parseInt(event.target.id);
  
    // Abre o banco de dados
    var request = window.indexedDB.open("dbContas", 3);
  
    request.onsuccess = function(event) {
      var db = event.target.result; // Obtém uma referência para o banco de dados
  
      // Inicia uma transação em modo de escrita
      var transaction = db.transaction(["tbDespesas"], "readwrite");
      var objectStore = transaction.objectStore("tbDespesas");
  
      // Busca o registro a ser atualizado
      var getRequest = objectStore.get(id);
  
      getRequest.onsuccess = function(event) {
        var conta = event.target.result; // Obtém o objeto
  
        // Atualiza as propriedades do objeto
        conta.titulo = document.getElementById("titulo").value;
        conta.valor = document.getElementById("valor").value;
  
        // Salva as alterações
        var putRequest = objectStore.put(conta);
  
        putRequest.onsuccess = function(event) {
          alert("Conta atualizada com sucesso");
          document.getElementById("pesquisar").click();
        };
  
        putRequest.onerror = function(event) {
          console.error("Erro ao atualizar a conta:", event.target.error);
        };
      };
    };
  }

//=====================================================
// funçãoes de utilidade eventual para carga e limpeza do banco de dados 
// Faz a Carga inicial do banco de dados

function carga() {
    const dbContas = window.indexedDB.open("dbContas", 3);

    dbContas.onupgradeneeded = (event) => {
        console.log("dbContas.onupgradeneeded");
        const db = event.target.result;
        // Cria um object store se não existir
        if (!db.objectStoreNames.contains("tbDespesas")) { 
            const tbDespesas = db.createObjectStore("tbDespesas", { keyPath: "id", autoIncrement: true });
            tbDespesas.createIndex("titulo", "titulo", { unique: false });
            tbDespesas.createIndex("valor", "valor", { unique: false });
        }
    };
    
    dbContas.onsuccess = (event) => {
        console.log("Adicionar uma despesa HSP");
        // Adicionar uma despesa
        //despesas.forEach(item => {
        for(despesa of despesas){     
            //console.log(despesa);
            const db = event.target.result;
            const transaction = db.transaction("tbDespesas", "readwrite");
            const tbDespesas = transaction.objectStore("tbDespesas");
            //var despesa = {"titulo":item.titulo,"valor":item.valor}; 
            var request = tbDespesas.add(despesa);
            request.onsuccess = () => {
                console.error('conta incluida com sucesso:');
            }
            request.onerror = () => {
                console.error('Erro ao adicionar conta:', request.error);
            }
        };
         
        console.log('Conta adicionada com sucesso!');
                
    
    };
}
// Faz a limpeza do banco de dados excluindo todos os registros
function excluirTudo(){
    const dbContas = window.indexedDB.open("dbContas", 3);
    dbContas.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("tbDespesas", "readwrite");
        var objectStore = transaction.objectStore("tbDespesas");
        var request = objectStore.index("titulo").openCursor();
        request.onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) { 
            objectStore.delete(cursor.primaryKey);
            console.log(`cursor.primaryKey=${cursor.primaryKey} ${cursor.titulo}`)
            cursor.continue();
          }
        };
    }
    dbContas.onerror = (error) => {
        console.log(error);
    }
};
function inicializar() {
    excluirTudo();   

    const dbContas = window.indexedDB.open("dbContas", 3);
    dbContas.onupgradeneeded = (event) => {
        console.log("dbContas.onupgradeneeded");
        const db = event.target.result;
        // Cria um object store se não existir
        if (!db.objectStoreNames.contains("tbDespesas")) { 
            const tbDespesas = db.createObjectStore("tbDespesas", { keyPath: "id", autoIncrement: true });
            tbDespesas.createIndex("titulo", "titulo", { unique: false });
        }
    };
    
    dbContas.onsuccess = (event) => {
        for(despesa of despesas){     
            const db = event.target.result;
            const transaction = db.transaction("tbDespesas", "readwrite");
            const tbDespesas = transaction.objectStore("tbDespesas");
            var request = tbDespesas.add(despesa);
            request.onsuccess = () => {
                console.error('conta incluida com sucesso:');
            }
            request.onerror = () => {
                console.error('Erro ao adicionar conta:', request.error);
            }
        };
    
      alert('banco inicializado com sucesso!!');
    }
}
