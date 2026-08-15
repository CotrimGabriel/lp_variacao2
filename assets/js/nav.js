/**
 * Navegação do cabeçalho.
 *
 * Responsabilidades:
 *  - alternar o menu em telas pequenas (com estado ARIA correto);
 *  - fechar o menu ao clicar fora, ao pressionar Esc ou ao voltar para desktop;
 *  - marcar o cabeçalho quando a página é rolada.
 *
 * O menu é uma melhoria progressiva: o cabeçalho nasce com a classe
 * `site-header--no-js` (barra estática, sempre acessível) e ela só é removida
 * quando este script assume o controle.
 */
(function (window, document) {
  'use strict';

  var MeiaUm = (window.MeiaUm = window.MeiaUm || {});

  /** Largura a partir da qual o menu é sempre visível (igual ao CSS). */
  var DESKTOP_BREAKPOINT = 900;

  /** Distância de rolagem para destacar o cabeçalho. */
  var SCROLL_THRESHOLD = 8;

  MeiaUm.initNav = function initNav() {
    var header = document.querySelector('[data-header]');
    if (!header) {
      return;
    }

    header.classList.remove('site-header--no-js');

    var toggle = header.querySelector('[data-nav-toggle]');
    var nav = header.querySelector('[data-nav]');
    var desktopQuery = window.matchMedia('(min-width: ' + DESKTOP_BREAKPOINT + 'px)');

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      nav.classList.toggle('is-open', open);
    }

    if (toggle && nav) {
      setOpen(false);

      toggle.addEventListener('click', function () {
        setOpen(!isOpen());
      });

      // Fecha ao navegar para outra página/âncora pelo próprio menu.
      nav.addEventListener('click', function (event) {
        if (event.target.closest('a') && !desktopQuery.matches) {
          setOpen(false);
        }
      });

      document.addEventListener('click', function (event) {
        if (isOpen() && !header.contains(event.target)) {
          setOpen(false);
        }
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && isOpen()) {
          setOpen(false);
          toggle.focus();
        }
      });

      // Ao passar para desktop o painel deixa de existir: normaliza o estado.
      addQueryListener(desktopQuery, function (matches) {
        if (matches && isOpen()) {
          setOpen(false);
        }
      });
    }

    // --- Sombra do cabeçalho conforme a rolagem ---------------------------
    // Listener passivo, sem leitura de layout: apenas alterna uma classe.
    function syncHeaderState() {
      header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    }

    window.addEventListener('scroll', syncHeaderState, { passive: true });
    syncHeaderState();
  };

  /** `addEventListener` em MediaQueryList com fallback para Safari antigo. */
  function addQueryListener(mediaQuery, handler) {
    var callback = function (event) {
      handler(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', callback);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(callback);
    }
  }
})(window, document);
