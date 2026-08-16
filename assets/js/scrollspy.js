/**
 * Destaque da seção ativa no menu.
 *
 * Como a página é uma landing única, os links do menu apontam para âncoras.
 * Este módulo observa as seções correspondentes e marca com `aria-current` o
 * link da seção que está em foco na tela — informação útil tanto visualmente
 * quanto para leitores de tela.
 *
 * Degradação: sem IntersectionObserver o menu simplesmente mantém o estado
 * inicial do HTML.
 */
(function (window, document) {
  'use strict';

  var MeiaUm = (window.MeiaUm = window.MeiaUm || {});

  MeiaUm.initScrollSpy = function initScrollSpy() {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    var links = toArray(document.querySelectorAll('[data-nav] .site-nav__link[href^="#"]'));
    var header = document.querySelector('[data-header]');
    var headerHeight = header ? header.offsetHeight : 0;

    // Só observamos as seções que realmente existem na página.
    var watched = [];
    links.forEach(function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) {
        watched.push({ link: link, section: section });
      }
    });

    if (watched.length === 0) {
      return;
    }

    var visible = {};

    function highlight() {
      // Em ordem do documento, a primeira seção visível é a "atual".
      var current = null;
      for (var i = 0; i < watched.length; i++) {
        if (visible[watched[i].section.id]) {
          current = watched[i].link;
          break;
        }
      }

      watched.forEach(function (item) {
        if (item.link === current) {
          item.link.setAttribute('aria-current', 'true');
        } else {
          item.link.removeAttribute('aria-current');
        }
      });
    }

    var observer = new window.IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible[entry.target.id] = true;
          } else {
            delete visible[entry.target.id];
          }
        });
        highlight();
      },
      {
        // Desconta o cabeçalho fixo no topo e ignora o rodapé da viewport,
        // para que a seção "atual" seja a que ocupa a área de leitura.
        rootMargin: -headerHeight + 'px 0px -55% 0px',
        threshold: 0
      }
    );

    watched.forEach(function (item) {
      observer.observe(item.section);
    });
  };

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }
})(window, document);
