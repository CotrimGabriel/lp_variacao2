/**
 * Revelação dos blocos conforme o usuário rola a página.
 *
 * Em vez de marcar dezenas de elementos no HTML, o módulo parte de uma lista de
 * seletores dos componentes que se repetem na landing. Cada elemento encontrado
 * recebe `data-reveal` (estado inicial, definido no CSS) e passa a ser observado;
 * ao entrar na tela ganha `is-revealed` e some da lista de observação, já que a
 * animação é de mão única — descer e subir de novo não reinicia o efeito.
 *
 * Elementos irmãos entram em cascata: o primeiro cartão de uma grade aparece,
 * depois o segundo, e assim por diante. O atraso é limitado para que grades
 * grandes não deixem o último item esperando tempo demais.
 *
 * Degradação: a classe `js-reveal` é ligada por um script embutido no <head>
 * (antes da primeira pintura, para o conteúdo não piscar) e só quando há suporte
 * a IntersectionObserver. Sem JS ela nunca aparece, o CSS não esconde nada e a
 * página fica igual à versão estática. Qualquer falha aqui também a remove, de
 * modo que nenhum bloco corre o risco de ficar invisível.
 */
(function (window, document) {
  'use strict';

  var MeiaUm = (window.MeiaUm = window.MeiaUm || {});

  // Componentes que ganham o efeito. O hero fica de fora: ele já está visível
  // quando a página abre e piscaria no carregamento.
  var TARGETS = [
    '.section__header',
    '.split__col',
    '.card',
    '.timeline__step',
    '.testimonial',
    '.feature-list__item',
    '.contact-list__item',
    '.chip',
    '.media'
  ].join(',');

  var MAX_STAGGER_STEPS = 4;

  MeiaUm.initReveal = function initReveal() {
    try {
      setup();
    } catch (error) {
      // Se a preparação falhar no meio, o estado inicial do CSS não pode
      // continuar de pé — sem ele os blocos voltam a ser visíveis.
      showEverything();
      throw error;
    }
  };

  function setup() {
    if (!('IntersectionObserver' in window)) {
      showEverything();
      return;
    }

    var elements = toArray(document.querySelectorAll(TARGETS)).filter(function (el) {
      // O hero já está na tela quando a página abre.
      if (el.closest('.hero')) {
        return false;
      }

      // Vários alvos se aninham (a coluna de um split contém cartões, chips,
      // imagem...). Anima só o mais externo: animações encaixadas somariam
      // deslocamento e opacidade, e o conjunto tremeria em vez de deslizar.
      return !el.parentElement.closest(TARGETS);
    });

    if (elements.length === 0) {
      showEverything();
      return;
    }

    // Lido uma vez só: getComputedStyle dentro do laço forçaria um recálculo
    // de estilo por elemento, sem necessidade — o valor é o mesmo para todos.
    var stagger = getStagger();

    // Cada elemento espera conforme sua posição entre os irmãos revelados.
    var seenPerParent = [];
    var countPerParent = [];

    elements.forEach(function (el) {
      var parent = el.parentNode;
      var slot = seenPerParent.indexOf(parent);

      if (slot === -1) {
        slot = seenPerParent.push(parent) - 1;
        countPerParent[slot] = 0;
      }

      var index = Math.min(countPerParent[slot], MAX_STAGGER_STEPS);
      countPerParent[slot] += 1;

      el.setAttribute('data-reveal', '');
      if (index > 0) {
        el.style.setProperty('--reveal-delay', index * stagger + 'ms');
      }
    });

    var observer = new window.IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      {
        // Começa um pouco antes de o bloco encostar na borda inferior, para que
        // ele termine de entrar já dentro do campo de visão.
        rootMargin: '0px 0px -12% 0px',
        threshold: 0
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Desliga o estado inicial: tudo volta a ser exibido normalmente.
  function showEverything() {
    document.documentElement.classList.remove('js-reveal');
  }

  function getStagger() {
    var raw = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--reveal-stagger');
    var parsed = parseInt(raw, 10);

    return isNaN(parsed) ? 80 : parsed;
  }

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }
})(window, document);
