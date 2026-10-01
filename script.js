(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const form = $('#quote-form');
  const result = $('#quote-result');
  const dialog = $('#preview-dialog');
  const preview = $('#preview-content');
  const feedback = $('#result-feedback');
  const salesEmail = 'sales@solarvision.co.za';
  // Sales contact published on the official site. WhatsApp availability should be verified by the business.
  const salesWhatsApp = '27639256902';
  let requestText = '';
  let requestData = {};
  $('#year').textContent = new Date().getFullYear();

  const toggle = $('.menu-toggle');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    $('.nav-links').classList.toggle('open', open);
  });
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    $('.nav-links').classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    const select = form.elements.service;
    const option = [...select.options].find(o => o.textContent === link.dataset.service);
    if (option) select.value = option.value;
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    requestData = Object.fromEntries(fd.entries());
    const labels = {
      service:'Solution area', name:'Name', phone:'Phone', email:'Email', location:'Project location',
      property:'Property type', bill:'Monthly electricity spend', priority:'Main priority', notes:'Additional details'
    };
    requestText = [
      'SOLAR VISION — QUOTATION REQUEST',
      'Please contact me to discuss a tailored solar solution. This is a request for an estimate, not a confirmed price.',
      '',
      ...Object.entries(labels).filter(([key]) => String(requestData[key] || '').trim()).map(([key, label]) => `${label}: ${String(requestData[key]).trim()}`),
      '', 'Sent from the Solar Vision website.'
    ].join('\n');
    const renderEntries = Object.entries(labels).filter(([key]) => String(requestData[key] || '').trim()).map(([key,label]) => {
      const value = escapeHtml(String(requestData[key]).trim());
      return `<div class="preview-item ${key==='notes'?'preview-notes':''}"><span>${label}</span><strong>${value}</strong></div>`;
    }).join('');
    preview.innerHTML = `<div class="preview-list">${renderEntries}</div><p class="fine-print">This enquiry contains no equipment pricing. Solar Vision can review your needs and prepare a tailored estimate.</p>`;
    result.hidden = false;
    feedback.textContent = '';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else result.scrollIntoView({behavior:'smooth', block:'nearest'});
  });

  $('#save-request').addEventListener('click', () => {
    if (!requestText) return;
    const blob = new Blob([requestText], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `solar-vision-quote-request-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
    feedback.textContent = 'Your request has been saved to your device.';
  });
  $('#send-whatsapp').addEventListener('click', () => {
    if (!requestText) return;
    window.open(`https://wa.me/${salesWhatsApp}?text=${encodeURIComponent(requestText)}`, '_blank', 'noopener');
    feedback.textContent = 'WhatsApp opened with your request. Confirm the sales number is active on WhatsApp before launch.';
  });
  $('#send-email').addEventListener('click', () => {
    if (!requestText) return;
    const subject = `Solar quotation request — ${requestData.name || 'Website enquiry'}`;
    window.location.href = `mailto:${salesEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestText)}`;
  });
  $('.dialog-close').addEventListener('click', () => dialog.close());
  $('#edit-request').addEventListener('click', () => dialog.close());
  $('#continue-send').addEventListener('click', () => { dialog.close(); result.scrollIntoView({behavior:'smooth',block:'center'}); });
  document.querySelectorAll('.button-bright[href="#quote"]').forEach(a => a.addEventListener('click', () => {}));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
})();
