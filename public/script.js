const API_URL = 'http://localhost:3000/api';
let currentSettings = {};

async function loadSettings() {
  try {
    const response = await fetch(`${API_URL}/settings`);
    currentSettings = await response.json();
    
    // Update header text
    const headerText = currentSettings.language === 'kh' 
      ? (currentSettings.headerTextKh || 'ឱកាសការងារ')
      : (currentSettings.headerText || 'Job Opportunities');
    document.querySelector('.rainbow-text').textContent = headerText;
    
    // Apply fonts
    document.documentElement.style.setProperty('--title-font', currentSettings.titleFont || 'Segoe UI');
    document.documentElement.style.setProperty('--description-font', currentSettings.descriptionFont || 'Segoe UI');
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

async function loadPosters() {
  try {
    const response = await fetch(`${API_URL}/posters`);
    const posters = await response.json();
    displayPosters(posters);
  } catch (error) {
    console.error('Error loading posters:', error);
  }
}

function displayPosters(posters) {
  const container = document.getElementById('posters-container');
  const isKhmer = currentSettings.language === 'kh';
  
  if (posters.length === 0) {
    const noPostersText = isKhmer ? 'មិនមានការងារនៅពេលនេះទេ។' : 'No job postings available at the moment.';
    container.innerHTML = `<div class="no-posters">${noPostersText}</div>`;
    return;
  }

  container.innerHTML = posters.map((poster, index) => {
    const title = isKhmer && poster.titleKh ? poster.titleKh : poster.title;
    const description = isKhmer && poster.descriptionKh ? poster.descriptionKh : poster.description;
    const applyText = isKhmer && poster.applyButtonTextKh ? poster.applyButtonTextKh : (poster.applyButtonText || 'Apply Now');
    const seeMoreText = isKhmer ? 'មើលបន្ថែម' : 'See More';
    const seeLessText = isKhmer ? 'មើលតិច' : 'See Less';
    
    // Check if description is long (more than 150 characters)
    const isLongDescription = description.length > 150;
    
    // Handle banner URL (Cloudinary or local)
    const bannerUrl = poster.banner ? 
      (poster.banner.startsWith('http') ? poster.banner : `uploads/${poster.banner}`) : '';
    
    return `
      <div class="poster-card">
        ${bannerUrl ? `<img src="${bannerUrl}" class="poster-banner" alt="${title}">` : ''}
        <h2 class="poster-title">${title}</h2>
        <div class="description-container">
          <p class="poster-description ${isLongDescription ? 'description-short' : ''}" id="desc-${index}">${description}</p>
          ${isLongDescription ? `<button class="see-more-btn" onclick="toggleDescription(${index})" id="btn-${index}">${seeMoreText}</button>` : ''}
        </div>
        
        ${poster.applyLink ? `<a href="${poster.applyLink}" class="apply-button" target="_blank">${applyText}</a>` : ''}
        
        <div class="contact-links">
          ${poster.phone ? `<a href="tel:${poster.phone}" class="contact-link phone">☎ ${poster.phone}</a>` : ''}
          ${poster.telegram ? `<a href="${poster.telegram}" class="contact-link telegram" target="_blank">✈ Telegram</a>` : ''}
          ${poster.facebook ? `<a href="${poster.facebook}" class="contact-link facebook" target="_blank">◆ Facebook</a>` : ''}
          ${poster.email ? `<a href="mailto:${poster.email}" class="contact-link email">✉ Email</a>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function toggleDescription(index) {
  const desc = document.getElementById(`desc-${index}`);
  const btn = document.getElementById(`btn-${index}`);
  const isKhmer = currentSettings.language === 'kh';
  const seeMoreText = isKhmer ? 'មើលបន្ថែម' : 'See More';
  const seeLessText = isKhmer ? 'មើលតិច' : 'See Less';
  
  if (desc.classList.contains('description-short')) {
    desc.classList.remove('description-short');
    desc.classList.add('description-full');
    btn.textContent = seeLessText;
  } else {
    desc.classList.add('description-short');
    desc.classList.remove('description-full');
    btn.textContent = seeMoreText;
  }
}

async function init() {
  await loadSettings();
  await loadPosters();
}

init();
