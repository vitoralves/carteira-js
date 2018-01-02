var carteiraControle = (function () {

    var Carteira = function (nome, valor) {
        this.nome = nome;
        this.valor = valor;
    }

    var Elemento = function (tipo, descricao, valor) {
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    var dados = {
        elementos: [],
        balanco: 0,
        totalEntradas: 0,
        totalSaidas: 0
    }

    return {
        getCarteira: function (nome, valor) {
            return new Carteira(nome, valor);
        },

        novoElemento: function (tipo, descricao, valor) {
            var novoElemento = new Elemento(tipo, descricao, valor);
            dados.elementos.push(novoElemento);

            //atualiza os totais
            if (tipo === 'e') { //entrada
                console.log(dados.balanco);
                console.log(valor);
                dados.balanco = parseFloat(dados.balanco) + parseFloat(valor);
                dados.totalEntradas = parseFloat(dados.totalEntradas) + parseFloat(valor);                
            } else if (tipo === 's') {
                dados.balanco -= valor;
                dados.totalSaidas += valor;
            }

            return novoElemento;
        },

        getDados: function () {
            return dados;
        },

        setaBalanco: function(valor) {
            dados.balanco = valor;
        }
    }

})();

var interfaceControler = (function () {
    var DOMStrings = {
        tooltip: '.tooltip-add',
        btnAdd: '.btn__add',
        dialog: '.mdl-dialog',
        salvarCarteira: '.salvar__carteira',
        valorCarteira: '.valor__carteira',
        nomeCarteira: '.nome__carteira',
        containerEsquerda: '.mdl-cell--4-col',
        nomeError: '.nome__error',
        valorError: '.valor__error',
        editCarteira: '.btn__edit__carteira',
        cardCarteira: '.demo-card-square',
        valorBalanco: '.valor__balanco',
        valorEntrada: '.valor__entrada',
        valorSaida: '.valor__saida',
        modalCancelar: '.close',
        tipoNovo: '.select_tipo',
        inputDesc: '.input_desc',
        inputValor: '.valor__form',
        btnInsereNovo: '.btn_nova_entrada',
        tipoValidator: '.tipo_validator',
        descValidator: '.desc_validator',
        valorValidator: '.valor_validator',
        containerDados: '.container__dados'
    }

    var formataValor = function (valor) {
        var novoValor;

        //retorna valor absoluto do numero
        novoValor = Math.abs(valor);

        //adiciona a notação .00 no final do número e transforma para string
        novoValor = novoValor.toFixed(2);

        //transforma em string e verifica o tamanho se for igual a 7 (2000.00) é um número de quatro casas ... adiciona a virgúla
        if (novoValor.length === 7) {
            novoValor = novoValor.substring(0, 1) + ',' + novoValor.substring(1, 7);
        }


        return novoValor;
    }

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },

        getInputCarteira: function () {
            return {
                nome: document.querySelector(DOMStrings.nomeCarteira).value,
                valor: document.querySelector(DOMStrings.valorCarteira).value
            }
        },

        getInputNovo: function () {
            return {
                tipo: document.querySelector(DOMStrings.tipoNovo).value,
                descricao: document.querySelector(DOMStrings.inputDesc).value,
                valor: document.querySelector(DOMStrings.inputValor).value
            }
        },

        exibeCarteira: function (carteira) {
            var html, element, cardCarteira;

            element = DOMStrings.containerEsquerda;
            //verifica se já foi inserirda uma carteira, portanto é uma edição
            cardCarteira = document.querySelector(DOMStrings.cardCarteira);
            //se já tem uma carteira na tela, remove antes de inserir a atualização
            if (cardCarteira) {
                cardCarteira.remove();
            }

            html = '<div class="demo-card-square mdl-card mdl-shadow--2dp centraliza-horizontal"><div class="mdl-card__title mdl-card--expand"><h2 class="mdl-card__title-text">' +
                '%nome%</h2></div><div class="mdl-card__supporting-text"><p><b>Valor:</b> R$ %valor%</p></div><div class="mdl-card__actions mdl-card--border">' +
                '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect btn__edit__carteira">Editar</a></div></div>';

            html = html.replace('%nome%', carteira.nome);
            html = html.replace('%valor%', formataValor(carteira.valor));

            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        atualizaElementos: function (dado) {
            var html, element;

            element = DOMStrings.containerDados;


            html = '<div class="mdl-cell mdl-cell--1-col"><i class="material-icons vertical-align">%tipo%</i></div><div class="mdl-cell mdl-cell--9-col">'
                + '<p class="paragrafo-linha">%descricao%</p></div><div class="mdl-cell mdl-cell--2-col"><p class="valor-linha">R$ %valor%</p></div>';

            //atualiza valores
            html = html.replace('%tipo%', dado.tipo === 'e' ? 'add' : 'remove');
            html = html.replace('%descricao%', dado.descricao);
            html = html.replace('%valor%', dado.valor);

            document.querySelector(element).insertAdjacentHTML('beforeend', html);

        },

        //remove a opção de inserção de carteira, antes verificar se os elementos estão presentes na tela, pois se for uma edição não é necessário removê-los
        removeTooltip: function () {
            var tooltip = document.querySelector(DOMStrings.tooltip);
            var btnAdd = document.querySelector(DOMStrings.btnAdd);
            if (tooltip) {
                tooltip.remove();
            }

            if (btnAdd) {
                btnAdd.remove();
            }
        },

        campoObrigatorio: function (campoDOM) {
            document.querySelector(campoDOM).style.visibility = 'visible';
        },

        fechaDialog: function () {
            var dialog = document.querySelector(DOMStrings.dialog);
            dialog.close();
        },

        setaValorBalanco: function (valor, entradas, saidas) {
            document.querySelector(DOMStrings.valorBalanco).textContent = formataValor(valor);
            document.querySelector(DOMStrings.valorEntrada).textContent = formataValor(entradas);
            document.querySelector(DOMStrings.valorSaida).textContent = formataValor(saidas);
        },

        limpaCampos: function() {
            document.querySelector(DOMStrings.tipoNovo).value = "";
            document.querySelector(DOMStrings.inputDesc).value = "";
            document.querySelector(DOMStrings.inputValor).value = "";
        }
    }

})();

var globalControler = (function (carteiraCtl, interfaceCtrl) {
    var DOM;

    var ciarEventos = function () {
        DOM = interfaceCtrl.getDOMStrings();

        document.querySelector(DOM.btnAdd).addEventListener('click', mostraModalCarteira);
        document.querySelector(DOM.salvarCarteira).addEventListener('click', salvarCarteira);
        document.querySelector(DOM.modalCancelar).addEventListener('click', interfaceCtrl.fechaDialog);
        document.querySelector(DOM.btnInsereNovo).addEventListener('click', inserirCarteira);
    }

    var inserirCarteira = function () {
        var inputs = interfaceCtrl.getInputNovo();
        //valida os campos
        if (inputs.tipo === '') {
            interfaceCtrl.campoObrigatorio(DOM.tipoValidator);
        } else if (inputs.descricao === '') {
            interfaceCtrl.campoObrigatorio(DOM.descValidator);
        } else if (!inputs.valor > 0) {
            interfaceCtrl.campoObrigatorio(DOM.valorValidator);
        } else {
            //cria novo elemento
            var elemento = carteiraCtl.novoElemento(inputs.tipo, inputs.descricao, inputs.valor);

            //atualiza dados na tela
            var carteiraDados = carteiraCtl.getDados();
            //passa novo elemento criado para ser adicionado na tela
            interfaceCtrl.atualizaElementos(elemento);
            interfaceCtrl.setaValorBalanco(carteiraDados.balanco, carteiraDados.totalEntradas, carteiraDados.totalSaidas);

            //limpa campos do formulário
            interfaceCtrl.limpaCampos();
        }
    }

    //recebe variavel tipo para informar se é uma nova carteira 'n' ou uma edição 'e'
    var salvarCarteira = function () {
        //salvar carteira
        var inputCarteira = interfaceCtrl.getInputCarteira();
        if (inputCarteira.nome === '') {
            interfaceCtrl.campoObrigatorio(DOM.nomeError);
        } else if (inputCarteira.valor <= 0) {
            interfaceCtrl.campoObrigatorio(DOM.valorError);
        } else {
            var carteira = carteiraCtl.getCarteira(inputCarteira.nome, inputCarteira.valor);

            interfaceCtrl.exibeCarteira(carteira);
            //remove o tooltip pois já temos uma carteira
            interfaceCtrl.removeTooltip();
            //fecha dialog
            interfaceCtrl.fechaDialog();
            //atualiza valor do balanço na tela
            interfaceCtrl.setaValorBalanco(carteira.valor, 0, 0);
            eventoEditaCarteira();
            //atualiza o valor do balanço do elemento dados
            carteiraCtl.setaBalanco(carteira.valor);
        }
    }

    var mostraModalCarteira = function () {
        //abre modal para inserir carteira
        var dialog = document.querySelector(DOM.dialog);
        dialog.showModal();
    }

    var eventoEditaCarteira = function () {
        document.querySelector(DOM.editCarteira).addEventListener('click', mostraModalCarteira);

    }

    return {
        init: function () {
            console.log('Iniciou');
            ciarEventos();

            //zera balanço
            interfaceCtrl.setaValorBalanco(0, 0, 0);
        }
    }
})(carteiraControle, interfaceControler);

globalControler.init();