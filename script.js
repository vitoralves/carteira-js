var carteiraControle = (function () {

    var Carteira = function (nome, valor) {
        this.nome = nome;
        this.valor = valor;
    }

    return {
        getCarteira: function (nome, valor) {
            return new Carteira(nome, valor);
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
        modalCancelar: '.close'
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
            html = html.replace('%valor%', carteira.valor);

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

        nomeObrigatorio: function () {
            document.querySelector(DOMStrings.nomeError).style.visibility = 'visible';
        },

        valorObrigatorio: function () {
            document.querySelector(DOMStrings.valorError).style.visibility = 'visible';
        },

        fechaDialog: function () {
            var dialog = document.querySelector(DOMStrings.dialog);
            dialog.close();
        },

        setaValorBalanco: function(valor) {
            document.querySelector(DOMStrings.valorBalanco).textContent(valor);
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
    }

    //recebe variavel tipo para informar se é uma nova carteira 'n' ou uma edição 'e'
    var salvarCarteira = function () {
        //salvar carteira
        var inputCarteira = interfaceCtrl.getInputCarteira();
        if (inputCarteira.nome === '') {
            interfaceCtrl.nomeObrigatorio();
        } else if (inputCarteira.valor <= 0) {
            interfaceCtrl.valorObrigatorio();
        } else {
            var carteira = carteiraCtl.getCarteira(inputCarteira.nome, inputCarteira.valor);

            interfaceCtrl.exibeCarteira(carteira);
            //remove o tooltip pois já temos uma carteira
            interfaceCtrl.removeTooltip();
            //fecha dialog
            interfaceCtrl.fechaDialog();
            //atualiza valor do balanço na tela
            interfaceCtrl.setaValorBalanco(carteira.valor);
            eventoEditaCarteira();
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
        }
    }
})(carteiraControle, interfaceControler);

globalControler.init();