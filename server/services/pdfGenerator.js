const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
    }
  }

  async generatePDF(cvData, template = 'modern') {
    try {
      await this.initialize();

      const page = await this.browser.newPage();

      // Set viewport for A4
      await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        deviceScaleFactor: 1
      });

      // Generate HTML content
      const htmlContent = this.generateHTML(cvData, template);

      // Set content
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        preferCSSPageSize: true
      });

      await page.close();

      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  generateHTML(cvData, template) {
    const { personalInfo, experience, education, skills, summary } = cvData;

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${personalInfo.firstName} ${personalInfo.lastName}</title>
        <style>
          ${this.getTemplateCSS(template)}
        </style>
      </head>
      <body>
        <div class="cv-container">
          <!-- Header -->
          <header class="cv-header">
            <h1>${personalInfo.firstName} ${personalInfo.lastName}</h1>
            <div class="contact-info">
              ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
              ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
              ${personalInfo.address ? `<span>${personalInfo.address}</span>` : ''}
            </div>
            <div class="social-links">
              ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}">LinkedIn</a>` : ''}
              ${personalInfo.website ? `<a href="${personalInfo.website}">Site Web</a>` : ''}
            </div>
          </header>

          <!-- Summary -->
          ${summary ? `
            <section class="cv-section">
              <h2>Profil</h2>
              <p class="summary-text">${summary}</p>
            </section>
          ` : ''}

          <!-- Experience -->
          ${experience && experience.length > 0 ? `
            <section class="cv-section">
              <h2>Expérience Professionnelle</h2>
              ${experience.map(exp => `
                <div class="experience-item">
                  <h3>${exp.position}</h3>
                  <div class="job-meta">
                    <span class="company">${exp.company}</span>
                    <span class="dates">${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}</span>
                  </div>
                  ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}

          <!-- Education -->
          ${education && education.length > 0 ? `
            <section class="cv-section">
              <h2>Formation</h2>
              ${education.map(edu => `
                <div class="education-item">
                  <h3>${edu.degree}</h3>
                  <div class="education-meta">
                    <span class="institution">${edu.institution}</span>
                    <span class="dates">${edu.startDate} - ${edu.endDate}</span>
                  </div>
                  ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}

          <!-- Skills -->
          ${skills && skills.length > 0 ? `
            <section class="cv-section">
              <h2>Compétences</h2>
              <div class="skills-list">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  }

  getTemplateCSS(template) {
    const baseCSS = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Times New Roman', serif;
        line-height: 1.6;
        color: #333;
        background: white;
      }

      .cv-container {
        max-width: 210mm;
        margin: 0 auto;
        padding: 20mm;
      }

      .cv-header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #333;
      }

      .cv-header h1 {
        font-size: 28pt;
        margin-bottom: 10px;
        color: #333;
      }

      .contact-info {
        display: flex;
        justify-content: center;
        gap: 15px;
        flex-wrap: wrap;
        margin-bottom: 10px;
        font-size: 10pt;
        color: #666;
      }

      .social-links {
        display: flex;
        justify-content: center;
        gap: 15px;
      }

      .social-links a {
        color: #0066cc;
        text-decoration: none;
        font-size: 10pt;
      }

      .cv-section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }

      .cv-section h2 {
        font-size: 16pt;
        color: #333;
        margin-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 5px;
      }

      .summary-text {
        font-style: italic;
        color: #555;
        font-size: 11pt;
      }

      .experience-item,
      .education-item {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }

      .experience-item h3,
      .education-item h3 {
        font-size: 14pt;
        margin-bottom: 5px;
        color: #333;
      }

      .job-meta,
      .education-meta {
        display: flex;
        justify-content: space-between;
        font-size: 10pt;
        color: #666;
        margin-bottom: 8px;
      }

      .company,
      .institution {
        font-weight: bold;
      }

      .dates {
        font-style: italic;
      }

      .description {
        font-size: 10pt;
        color: #555;
        line-height: 1.5;
      }

      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .skill-tag {
        background: #f8f9fa;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 9pt;
        color: #333;
        border: 1px solid #e0e0e0;
      }

      @page {
        size: A4;
        margin: 20mm;
      }

      @media print {
        .cv-container {
          margin: 0;
          padding: 0;
        }
      }
    `;

    // Template-specific CSS variations
    const templateCSS = {
      modern: `
        .cv-header h1 {
          color: #2c3e50;
        }
        .cv-section h2 {
          color: #3498db;
          border-bottom-color: #3498db;
        }
        .skill-tag {
          background: #ecf0f1;
          color: #2c3e50;
        }
      `,
      classic: `
        .cv-header h1 {
          color: #000;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .cv-section h2 {
          color: #000;
          text-transform: uppercase;
          font-size: 14pt;
        }
      `,
      creative: `
        .cv-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .cv-header h1 {
          color: white;
        }
        .contact-info,
        .social-links a {
          color: #f0f0f0;
        }
        .cv-section h2 {
          color: #667eea;
        }
        .skill-tag {
          background: #667eea;
          color: white;
        }
      `
    };

    return baseCSS + (templateCSS[template] || '');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = new PDFGenerator();