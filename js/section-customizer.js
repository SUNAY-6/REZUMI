/* ============================================
   REZUMI - Section Customizer
   Rename and reorder resume sections
   ============================================ */

const SectionCustomizer = {
    defaultSections: [
        { id: 'summary', name: 'Professional Summary', icon: 'fa-align-left', required: true },
        { id: 'experience', name: 'Experience', icon: 'fa-briefcase', required: false },
        { id: 'education', name: 'Education', icon: 'fa-graduation-cap', required: false },
        { id: 'skills', name: 'Skills', icon: 'fa-code', required: false },
        { id: 'projects', name: 'Projects', icon: 'fa-diagram-project', required: false },
        { id: 'certifications', name: 'Certifications', icon: 'fa-certificate', required: false },
        { id: 'achievements', name: 'Achievements', icon: 'fa-trophy', required: false },
        { id: 'languages', name: 'Languages', icon: 'fa-language', required: false },
        { id: 'hobbies', name: 'Hobbies & Interests', icon: 'fa-heart', required: false }
    ],

    // Get custom section config from resume or use defaults
    getSections(resumeData) {
        if (resumeData?.customSections) {
            return resumeData.customSections;
        }
        return this.defaultSections.map(s => ({ ...s }));
    },

    // Save custom sections to resume data
    saveSections(resumeData, sections) {
        if (!resumeData) return;
        resumeData.customSections = sections;
        Storage.saveResume(resumeData);
    },

    // Open section customizer modal
    open(resumeData) {
        if (!resumeData) {
            resumeData = currentResumeData || Storage.getResumes().slice(-1)[0];
        }
        if (!resumeData) {
            showToast('No resume to customize', 'error');
            return;
        }

        const sections = this.getSections(resumeData);
        window._scData = resumeData;
        window._scSections = JSON.parse(JSON.stringify(sections));

        this.renderModal();
    },

    renderModal() {
        const sections = window._scSections;

        openModal('Customize Sections', `
            <div>
                <p style="font-size:12px;color:var(--text-secondary);margin-bottom:16px;">
                    Rename headings and reorder sections. Changes apply instantly to your resume preview.
                </p>
                
                <div id="sc-section-list" style="display:flex;flex-direction:column;gap:8px;">
                    ${sections.map((s, i) => `
                        <div class="glass-card sc-section-item" data-index="${i}" style="padding:10px 14px;display:flex;align-items:center;gap:10px;">
                            <div class="sc-drag-handle" style="cursor:grab;color:var(--text-muted);padding:4px;" title="Drag to reorder">
                                <i class="fas fa-grip-vertical"></i>
                            </div>
                            <i class="fas ${s.icon}" style="color:var(--accent);width:18px;text-align:center;font-size:13px;"></i>
                            <input type="text" class="form-input" value="${this.escHtml(s.name)}" 
                                   onchange="SectionCustomizer.updateName(${i}, this.value)"
                                   style="flex:1;font-size:13px;padding:6px 10px;min-height:36px;"
                                   placeholder="Section name">
                            <div style="display:flex;flex-direction:column;gap:2px;">
                                <button class="btn btn-ghost btn-sm" style="padding:2px 6px;min-height:24px;" 
                                        onclick="SectionCustomizer.moveUp(${i})" ${i === 0 ? 'disabled style="opacity:0.3;"' : ''}>
                                    <i class="fas fa-chevron-up" style="font-size:10px;"></i>
                                </button>
                                <button class="btn btn-ghost btn-sm" style="padding:2px 6px;min-height:24px;" 
                                        onclick="SectionCustomizer.moveDown(${i})" ${i === sections.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>
                                    <i class="fas fa-chevron-down" style="font-size:10px;"></i>
                                </button>
                            </div>
                            ${!s.required ? `
                                <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-tertiary);cursor:pointer;">
                                    <input type="checkbox" ${s.visible !== false ? 'checked' : ''} onchange="SectionCustomizer.toggleVisibility(${i}, this.checked)">
                                    Show
                                </label>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top:16px;padding:10px;background:var(--bg-card);border-radius:var(--radius-md);font-size:11px;color:var(--text-tertiary);">
                    <i class="fas fa-info-circle" style="margin-right:4px;"></i>
                    Drag the ⋮⋮ handle to reorder sections. Toggle visibility to hide sections from the resume.
                </div>
            </div>
        `, `
            <button class="btn btn-ghost" onclick="SectionCustomizer.resetDefaults()">Reset Defaults</button>
            <button class="btn btn-primary" onclick="SectionCustomizer.applyChanges()">Apply</button>
        `);

        // Init drag and drop
        this.initDragDrop();
    },

    initDragDrop() {
        const list = document.getElementById('sc-section-list');
        if (!list) return;

        let draggedItem = null;
        let draggedIndex = -1;

        list.querySelectorAll('.sc-section-item').forEach(item => {
            const handle = item.querySelector('.sc-drag-handle');
            
            handle.addEventListener('mousedown', (e) => {
                draggedItem = item;
                draggedIndex = parseInt(item.dataset.index);
                item.style.opacity = '0.5';
                e.preventDefault();
            });

            handle.addEventListener('touchstart', (e) => {
                draggedItem = item;
                draggedIndex = parseInt(item.dataset.index);
                item.style.opacity = '0.5';
            }, { passive: true });
        });

        const onMove = (clientY) => {
            if (!draggedItem) return;
            
            const items = [...list.querySelectorAll('.sc-section-item')];
            const draggedRect = draggedItem.getBoundingClientRect();
            const midY = draggedRect.top + draggedRect.height / 2;
            
            items.forEach((item, idx) => {
                if (item === draggedItem) return;
                const rect = item.getBoundingClientRect();
                const itemMid = rect.top + rect.height / 2;
                
                if (clientY < itemMid && draggedIndex > idx) {
                    list.insertBefore(draggedItem, item);
                    draggedIndex = idx;
                } else if (clientY > itemMid && draggedIndex < idx) {
                    list.insertBefore(draggedItem, item.nextSibling);
                    draggedIndex = idx;
                }
            });
        };

        document.addEventListener('mousemove', (e) => onMove(e.clientY));
        document.addEventListener('touchmove', (e) => {
            if (draggedItem) onMove(e.touches[0].clientY);
        }, { passive: true });

        const onEnd = () => {
            if (draggedItem) {
                draggedItem.style.opacity = '1';
                
                // Update order in sections array
                const items = [...list.querySelectorAll('.sc-section-item')];
                const newOrder = items.map((item, idx) => {
                    const oldIdx = parseInt(item.dataset.index);
                    return window._scSections[oldIdx];
                });
                window._scSections = newOrder;
                
                // Re-render to update indices and button states
                this.renderModal();
            }
            draggedItem = null;
        };

        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    },

    updateName(index, name) {
        if (window._scSections[index]) {
            window._scSections[index].name = name;
        }
    },

    moveUp(index) {
        if (index <= 0) return;
        const sections = window._scSections;
        [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
        this.renderModal();
    },

    moveDown(index) {
        if (index >= window._scSections.length - 1) return;
        const sections = window._scSections;
        [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
        this.renderModal();
    },

    toggleVisibility(index, visible) {
        if (window._scSections[index]) {
            window._scSections[index].visible = visible;
        }
    },

    resetDefaults() {
        window._scSections = this.defaultSections.map(s => ({ ...s }));
        this.renderModal();
        showToast('Sections reset to defaults', 'info');
    },

    applyChanges() {
        if (window._scData && window._scSections) {
            // Deep copy sections to prevent reference issues
            const sectionsCopy = JSON.parse(JSON.stringify(window._scSections));
            
            // Save to resume data
            this.saveSections(window._scData, sectionsCopy);
            
            // Update current resume data reference
            currentResumeData = window._scData;
            
            // Force re-render of ALL preview instances
            if (typeof renderResumePreview === 'function') {
                renderResumePreview();
            }
            if (typeof updateManualPreview === 'function') {
                updateManualPreview();
            }
            
            // Also update manual builder data if present
            if (typeof manualData !== 'undefined') {
                manualData.customSections = sectionsCopy;
            }
            
            closeModal();
            showToast('Sections saved and preview updated!', 'success');
        }
    },

    escHtml(str) {
        return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }
};

// Make globally accessible
window.SectionCustomizer = SectionCustomizer;
