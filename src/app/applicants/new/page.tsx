
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  CloudUpload,
  ArrowRight,
  Mic,
  Plus,
  Trash2,
  Building2
} from 'lucide-react';

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dob: '',
    documentId: '',
    phone: '',
    consent: false
  });

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const [experiences, setExperiences] = useState<any[]>([
    { id: Date.now().toString(), cargo: '', empresa: '', tipo: 'Formal', fechaInicio: '', fechaFin: '', actualmente: false, descripcion: '' }
  ]);
  const [isRecording, setIsRecording] = useState<string | null>(null);

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      cargo: '',
      empresa: '',
      tipo: 'Formal',
      fechaInicio: '',
      fechaFin: '',
      actualmente: false,
      descripcion: ''
    }]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const startSpeechToText = (id: string) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Su navegador no soporta el reconocimiento de voz. Por favor use Chrome.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsRecording(id);
    recognition.onend = () => setIsRecording(null);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const exp = experiences.find(e => e.id === id);
      if (exp) {
        updateExperience(id, 'descripcion', exp.descripcion + (exp.descripcion ? ' ' : '') + transcript);
      }
    };

    recognition.start();
  };

  const [currentStep, setCurrentStep] = useState(2); // Start at step 2 as requested by designs showing Step 3 of 5

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else handleSubmit();
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.consent) {
      alert("Please accept data processing terms.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('surname', formData.surname);
      data.append('dob', formData.dob);
      data.append('documentId', formData.documentId);
      data.append('phone', formData.phone);
      data.append('experiences', JSON.stringify(experiences));
      if (file) data.append('cv', file);

      const response = await fetch('/api/applicants', {
        method: 'POST',
        body: data,
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();

        if (response.ok) {
          alert("Registration successful!");
          setFormData({ name: '', surname: '', dob: '', documentId: '', phone: '', consent: false });
          setExperiences([{ id: Date.now().toString(), cargo: '', empresa: '', tipo: 'Formal', fechaInicio: '', fechaFin: '', actualmente: false, descripcion: '' }]);
          setFile(null);
          setCurrentStep(1);
        } else {
          alert(`Error: ${result.error || 'Something went wrong'}`);
        }
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        alert(`Server Error: Received HTML instead of JSON. Check console for details.`);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Submission failed. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <div className="breadcrumbs">Talent Management &nbsp;›&nbsp; Registration</div>
          <h1 className="page-title">Talent Registration</h1>
          <p className="page-subtitle">Onboard elite talent into the Disruptia ecosystem. Fill out the professional profile below to begin the verification process.</p>
        </div>
      </header>

      <div className="form-container">
        {/* Step Navigation Tabs */}
        <div className="form-wizard-header">
          <div className={`wizard-step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`} onClick={() => setCurrentStep(1)}>
            <div className="step-number">1</div>
            <div className="step-label">Información Personal</div>
          </div>
          <div className={`wizard-step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`} onClick={() => setCurrentStep(2)}>
            <div className="step-number">2</div>
            <div className="step-label">Historial Profesional</div>
          </div>
          <div className={`wizard-step ${currentStep === 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>
            <div className="step-number">3</div>
            <div className="step-label">Documentación</div>
          </div>
        </div>

        {currentStep === 1 && (
          <>
            <div className="step-indicator">
              <span className="step-pill">PASO 1 DE 5</span>
              <span>• Información Personal</span>
            </div>
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Información Personal</h1>
            <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>Cuéntanos sobre ti para completar tu perfil profesional.</p>

            <div className="form-card">
              <h2 className="section-title">
                <Briefcase size={22} />
                Personal Information
              </h2>
              <div className="form-grid">
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" name="name" className="form-input" placeholder="e.g. Alexander" value={formData.name} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
                <div className="input-group">
                  <label>Surname</label>
                  <input type="text" name="surname" className="form-input" placeholder="e.g. Hamilton" value={formData.surname} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
                <div className="input-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" className="form-input" value={formData.dob} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
                <div className="input-group">
                  <label>Document Number (ID/Passport)</label>
                  <input type="text" name="documentId" className="form-input" placeholder="Enter identification number" value={formData.documentId} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
                <div className="input-group">
                  <label>Phone Number (Celular)</label>
                  <input type="text" name="phone" className="form-input" placeholder="e.g. 3157281832" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="step-indicator">
              <span className="step-pill">PASO 3 DE 5</span>
              <span>• Historial Profesional</span>
            </div>
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Experiencia Laboral</h1>
            <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>
              Detalla tu historial profesional reciente. Utiliza la herramienta de voz para describir tus responsabilidades más rápido.
            </p>

            {experiences.map((exp) => (
              <div key={exp.id} className="experience-card">
                {experiences.length > 1 && (
                  <button className="btn-delete" onClick={() => removeExperience(exp.id)}>
                    <Trash2 size={20} />
                  </button>
                )}

                <div className="form-grid">
                  <div className="input-group">
                    <label>Cargo / Posición</label>
                    <input type="text" className="form-input" placeholder="Ej: Desarrollador Frontend" value={exp.cargo} onChange={(e) => updateExperience(exp.id, 'cargo', e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div className="input-group">
                    <label>Tipo de empleo</label>
                    <div className="experience-type-toggle">
                      <button className={`toggle-item ${exp.tipo === 'Formal' ? 'active' : ''}`} onClick={() => updateExperience(exp.id, 'tipo', 'Formal')}>Formal</button>
                      <button className={`toggle-item ${exp.tipo === 'Informal' ? 'active' : ''}`} onClick={() => updateExperience(exp.id, 'tipo', 'Informal')}>Informal</button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Empresa</label>
                    <div style={{ position: 'relative' }}>
                      <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input type="text" className="form-input" style={{ paddingLeft: '36px' }} placeholder="Nombre de la empresa" value={exp.empresa} onChange={(e) => updateExperience(exp.id, 'empresa', e.target.value)} disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Periodo</label>
                    <div className="period-grid">
                      <input type="text" className="form-input" placeholder="Inicio" value={exp.fechaInicio} onChange={(e) => updateExperience(exp.id, 'fechaInicio', e.target.value)} disabled={isSubmitting} />
                      <span className="period-separator">a</span>
                      <input type="text" className="form-input" placeholder="Fin" value={exp.fechaFin} onChange={(e) => updateExperience(exp.id, 'fechaFin', e.target.value)} disabled={isSubmitting || exp.actualmente} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <input type="checkbox" checked={exp.actualmente} onChange={(e) => updateExperience(exp.id, 'actualmente', e.target.checked)} />
                      <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Actualmente trabajo aquí</label>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Descripción de responsabilidades</label>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sé detallado para mejorar el matching</span>
                  </div>
                  <textarea
                    className="form-input"
                    rows={4}
                    style={{ resize: 'vertical' }}
                    placeholder="Describe tus logros, herramientas utilizadas y responsabilidades diarias..."
                    value={exp.descripcion}
                    onChange={(e) => updateExperience(exp.id, 'descripcion', e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                  <div className="mic-button-container">
                    <button className={`btn-mic ${isRecording === exp.id ? 'recording' : ''}`} onClick={() => startSpeechToText(exp.id)}>
                      <Mic size={16} />
                      {isRecording === exp.id ? 'Escuchando...' : 'Grabar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button className="btn-add-experience" onClick={addExperience}>
              <Plus size={20} />
              Añadir otra experiencia
            </button>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="step-indicator">
              <span className="step-pill">PASO 5 DE 5</span>
              <span>• Finalización</span>
            </div>
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Documentación</h1>
            <p className="page-subtitle" style={{ marginBottom: '2.5rem' }}>Sube tus documentos y acepta los términos para finalizar el registro.</p>

            <div className="form-card">
              <h2 className="section-title">
                <FileText size={22} />
                Professional Documents
              </h2>
              <div className={`upload-area ${isDragging ? 'dragging' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => !isSubmitting && document.getElementById('file-upload')?.click()}>
                <input type="file" id="file-upload" style={{ display: 'none' }} onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".pdf" disabled={isSubmitting} />
                <div className="upload-icon-circle"><CloudUpload size={32} /></div>
                <p className="upload-text">{file ? file.name : 'Upload Curriculum Vitae'}</p>
                <p className="upload-subtext">Drag and drop your PDF file here, or <span className="upload-link">browse files</span></p>
              </div>
            </div>

            <div className={`consent-box ${formData.consent ? 'active' : ''}`}>
              <div className={`checkbox ${formData.consent ? 'checked' : ''}`} onClick={() => !isSubmitting && setFormData(prev => ({ ...prev, consent: !prev.consent }))}>
                {formData.consent && <ArrowRight size={14} color="white" />}
              </div>
              <div>
                <strong>Accept Data Processing</strong>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  I consent to the processing of my personal data for recruitment and selection purposes according to the <span style={{ color: 'var(--primary-purple)', fontWeight: 600 }}>Privacy Policy</span>.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Submit */}
        <div className="btn-group">
          <Link href="/" className="btn-secondary">Atrás</Link>
          <button type="button" className="btn-primary" onClick={handleNextStep} disabled={isSubmitting}>
            {currentStep === 3 ? (isSubmitting ? 'Guardando...' : 'Finalizar Registro') : 'Guardar y Continuar'}
            {!isSubmitting && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </>
  );
}
