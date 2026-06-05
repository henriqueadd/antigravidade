document.addEventListener('DOMContentLoaded', () => {
  
  // ----------------------------------------------------
  // 1. SMOOTH SCROLL ANCHORS
  // ----------------------------------------------------
  const heroActionBtn = document.getElementById('hero-action-btn');
  if (heroActionBtn) {
    heroActionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const planosSection = document.getElementById('planos');
      if (planosSection) {
        planosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  const scrollToPremiumBtn = document.getElementById('scroll-to-premium-btn');
  if (scrollToPremiumBtn) {
    scrollToPremiumBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const premiumCard = document.getElementById('premium-card');
      if (premiumCard) {
        premiumCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // ----------------------------------------------------
  // 2. FAQ ACCORDION (Single open behavior)
  // ----------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach((item, index) => {
    const btn = item.querySelector('.faq-btn');
    const content = item.querySelector('.faq-content');
    const chevron = item.querySelector('.faq-chevron');

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherBtn = otherItem.querySelector('.faq-btn');
          const otherContent = otherItem.querySelector('.faq-content');
          const otherChevron = otherItem.querySelector('.faq-chevron');

          otherBtn.setAttribute('aria-expanded', 'false');
          otherContent.classList.remove('grid-rows-[1fr]', 'opacity-100', 'pb-4');
          otherContent.classList.add('grid-rows-[0fr]', 'opacity-0');
          otherChevron.classList.remove('rotate-180');
        }
      });

      // Toggle current item
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        content.classList.remove('grid-rows-[1fr]', 'opacity-100', 'pb-4');
        content.classList.add('grid-rows-[0fr]', 'opacity-0');
        chevron.classList.remove('rotate-180');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        content.classList.remove('grid-rows-[0fr]', 'opacity-0');
        content.classList.add('grid-rows-[1fr]', 'opacity-100', 'pb-4');
        chevron.classList.add('rotate-180');
      }
    });
  });

  // ----------------------------------------------------
  // 3. UPSELL MODAL & CHECKOUT FUNNEL
  // ----------------------------------------------------
  const upsellModal = document.getElementById('upsell-modal');
  const essencialBuyBtn = document.getElementById('essencial-buy-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalUpgradeBtn = document.getElementById('modal-upgrade-btn');
  const modalEssencialBtn = document.getElementById('modal-essencial-btn');

  // Checkout URLs
  const ESSENCIAL_URL = "https://pay.cakto.com.br/vkx53n8_901344";
  const PREMIUM_DISCOUNTED_URL = "https://pay.cakto.com.br/g8rv9vy_901374";

  // Use sessionStorage to persist upsell state during single browser session
  const checkUpsellShown = () => {
    return sessionStorage.getItem('upsell_shown') === 'true';
  };

  const setUpsellShown = () => {
    sessionStorage.setItem('upsell_shown', 'true');
  };

  // Click on "Quero o Kit Essencial" on pricing card
  if (essencialBuyBtn) {
    essencialBuyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (checkUpsellShown()) {
        // Redirect directly to Essencial checkout if they have already seen the modal
        window.open(ESSENCIAL_URL, '_blank', 'noopener,noreferrer');
      } else {
        // First click: Open upsell modal
        setUpsellShown();
        if (upsellModal) {
          upsellModal.classList.remove('hidden');
          document.body.style.overflow = 'hidden'; // Lock background scrolling
        }
      }
    });
  }

  // Close Upsell Modal (Click X)
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (upsellModal) {
        upsellModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore background scrolling
      }
    });
  }

  // "Não, obrigada. Quero só o Essencial por R$17,90" on modal
  if (modalEssencialBtn) {
    modalEssencialBtn.addEventListener('click', () => {
      if (upsellModal) {
        upsellModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
      window.open(ESSENCIAL_URL, '_blank', 'noopener,noreferrer');
    });
  }

  // "✅ Sim! Quero o Premium por R$22,90 →" on modal
  if (modalUpgradeBtn) {
    modalUpgradeBtn.addEventListener('click', () => {
      if (upsellModal) {
        upsellModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
      window.open(PREMIUM_DISCOUNTED_URL, '_blank', 'noopener,noreferrer');
    });
  }

  // Close modal if user clicks outside the modal card overlay
  if (upsellModal) {
    upsellModal.addEventListener('click', (e) => {
      if (e.target === upsellModal) {
        upsellModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
});
