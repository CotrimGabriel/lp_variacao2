/**
 * Ponto de entrada.
 *
 * Cada módulo é carregado antes deste arquivo (scripts com `defer` executam na
 * ordem em que aparecem no HTML) e apenas registra sua função de inicialização
 * em `window.MeiaUm`. Aqui decidimos o que roda em cada página — os módulos
 * ausentes são simplesmente ignorados.
 */
(function (window) {
  'use strict';

  var MeiaUm = (window.MeiaUm = window.MeiaUm || {});

  var modules = ['initNav', 'initScrollSpy', 'initContactForm'];

  modules.forEach(function (name) {
    if (typeof MeiaUm[name] !== 'function') {
      return;
    }

    try {
      MeiaUm[name]();
    } catch (error) {
      // Uma falha isolada não pode derrubar o restante da página.
      window.console.error('[Meia-Um] Falha ao iniciar "' + name + '":', error);
    }
  });

  // Ano corrente no rodapé, evitando copyright desatualizado.
  var yearSlots = document.querySelectorAll('[data-current-year]');
  Array.prototype.forEach.call(yearSlots, function (slot) {
    slot.textContent = String(new Date().getFullYear());
  });
})(window);
