/**
 * Formulário de contato.
 *
 * Usa a Constraint Validation API do próprio navegador (required, type,
 * minlength, pattern) e apenas troca as mensagens padrão por textos em
 * português exibidos junto de cada campo. Sem JavaScript o formulário
 * continua validando de forma nativa.
 *
 * O envio é simulado: não há back-end neste projeto estático. Substitua o
 * corpo de `sendLead()` por uma chamada ao seu endpoint/CRM.
 */
(function (window, document) {
  'use strict';

  var MeiaUm = (window.MeiaUm = window.MeiaUm || {});

  var MESSAGES = {
    valueMissing: 'Preencha este campo para continuar.',
    typeMismatch: 'Informe um e-mail válido (exemplo: nome@email.com).',
    tooShort: 'Descreva um pouco mais para entendermos o seu caso.',
    patternMismatch: 'Informe um telefone válido com DDD (ex.: (61) 99999-9999).',
    default: 'Verifique este campo.'
  };

  MeiaUm.initContactForm = function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) {
      return;
    }

    var status = form.querySelector('[data-form-status]');
    var fields = Array.prototype.slice.call(
      form.querySelectorAll('input, select, textarea')
    );

    // Validação nativa desativada para controlarmos as mensagens.
    form.setAttribute('novalidate', '');

    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });

      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearStatus(status);

      var invalidFields = fields.filter(function (field) {
        return !validateField(field);
      });

      if (invalidFields.length > 0) {
        setStatus(status, 'error', 'Revise os campos destacados antes de enviar.');
        invalidFields[0].focus();
        return;
      }

      submit(form, status);
    });
  };

  /** Valida um campo e desenha (ou limpa) a mensagem associada. */
  function validateField(field) {
    var errorBox = document.getElementById(field.getAttribute('aria-describedby'));
    var valid = field.checkValidity();

    field.setAttribute('aria-invalid', String(!valid));

    if (errorBox) {
      errorBox.textContent = valid ? '' : messageFor(field);
    }

    return valid;
  }

  /** Escolhe a mensagem em português para o primeiro erro do campo. */
  function messageFor(field) {
    var state = field.validity;

    if (state.valueMissing) return MESSAGES.valueMissing;
    if (state.typeMismatch) return MESSAGES.typeMismatch;
    if (state.patternMismatch) return field.dataset.errorPattern || MESSAGES.patternMismatch;
    if (state.tooShort) return MESSAGES.tooShort;

    return MESSAGES.default;
  }

  /** Encaminha os dados e cuida do estado visual do botão. */
  function submit(form, status) {
    var button = form.querySelector('[type="submit"]');
    var originalLabel = button ? button.textContent : '';
    var payload = Object.fromEntries(new FormData(form).entries());

    if (button) {
      button.disabled = true;
      button.textContent = 'Enviando...';
    }

    sendLead(payload)
      .then(function () {
        form.reset();
        form.querySelectorAll('[data-field-error]').forEach(function (box) {
          box.textContent = '';
        });
        form.querySelectorAll('[aria-invalid]').forEach(function (field) {
          field.setAttribute('aria-invalid', 'false');
        });
        setStatus(
          status,
          'success',
          'Recebemos seus dados. Um especialista da Meia-Um entra em contato em até 1 dia útil.'
        );
      })
      .catch(function () {
        setStatus(
          status,
          'error',
          'Não foi possível enviar agora. Tente novamente em instantes.'
        );
      })
      .finally(function () {
        if (button) {
          button.disabled = false;
          button.textContent = originalLabel;
        }
      });
  }

  /**
   * Ponto de integração. Troque por, por exemplo:
   *
   *   return fetch('/api/leads', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify(payload)
   *   }).then(function (response) {
   *     if (!response.ok) throw new Error(response.statusText);
   *   });
   */
  function sendLead(payload) {
    return new Promise(function (resolve) {
      window.console.info('[Meia-Um] Lead capturado:', payload);
      window.setTimeout(resolve, 600);
    });
  }

  function setStatus(element, type, message) {
    if (!element) {
      return;
    }
    element.className = 'form__status form__status--' + type;
    element.textContent = message;
  }

  function clearStatus(element) {
    if (element) {
      element.className = 'form__status';
      element.textContent = '';
    }
  }
})(window, document);
