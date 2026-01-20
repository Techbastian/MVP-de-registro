
document.addEventListener('DOMContentLoaded', () => {
    // Styling the sidebar active state based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Simple logic to set active class (for demo)
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // File Upload Drag & Drop Visuals
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            uploadArea.style.borderColor = 'var(--primary-purple)';
            uploadArea.style.backgroundColor = '#F3F4F6';
        }

        function unhighlight(e) {
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.backgroundColor = '#FAFAFA';
        }
        
        uploadArea.addEventListener('drop', handleDrop, false);
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            // Handle files (Demo only - console log)
            console.log(files);
            alert(`Received ${files.length} file(s): ${files[0].name}`);
        }
    }

    // Candidate Expand/Collapse Logic (Records Page)
    const expandButtons = document.querySelectorAll('.btn-expand-details, .candidate-row');
    
    expandButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent triggering if clicking specific action buttons inside the row
            if (e.target.closest('.no-trigger')) return;

            const item = btn.closest('.candidate-item');
            if (item) {
                // Toggle current
                item.classList.toggle('expanded');
                
                // Optional: Collapse others (Accordion style) - user didn't specify, but often good UI
                // document.querySelectorAll('.candidate-item').forEach(other => {
                //     if (other !== item) other.classList.remove('expanded');
                // });
            }
        });
    });
});
