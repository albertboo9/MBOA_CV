import React from 'react';

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Moderne',
      description: 'Design épuré et professionnel',
      preview: '/templates/modern-preview.png'
    },
    {
      id: 'classic',
      name: 'Classique',
      description: 'Style traditionnel et formel',
      preview: '/templates/classic-preview.png'
    },
    {
      id: 'creative',
      name: 'Créatif',
      description: 'Design original et coloré',
      preview: '/templates/creative-preview.png'
    }
  ];

  return (
    <div className="template-selector">
      <h3>Choisissez un modèle</h3>
      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => onTemplateChange(template.id)}
          >
            <div className="template-preview">
              {/* Placeholder for template preview image */}
              <div className="preview-placeholder">
                <span>{template.name}</span>
              </div>
            </div>
            <div className="template-info">
              <h4>{template.name}</h4>
              <p>{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;