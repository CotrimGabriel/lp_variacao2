/**
 * Cards de "Situações" -> formulário de contato.
 *
 * Cada card em #situacoes é um link comum para #contato (funciona sem JS,
 * com rolagem suave via CSS). Aqui apenas somamos um comportamento: ao
 * clicar, pré-selecionamos no formulário a opção correspondente do campo
 * "Situação do imóvel", pelo atributo `data-situacao` do card.
 */
(function (window, document) {
  'use strict';

  var MeiaUm = (window.MeiaUm = window.MeiaUm || {});

  MeiaUm.initSituationCards = function initSituationCards() {
    var select = document.getElementById('situacao');
    if (!select) {
      return;
    }

    var cards = document.querySelectorAll('[data-situacao]');
    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener('click', function () {
        var value = card.getAttribute('data-situacao');
        if (!value) {
          return;
        }

        select.value = value;
        // Dispara 'change' para que a validação em form.js reaja e limpe
        // qualquer erro já exibido no campo.
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  };
})(window, document);
