document.addEventListener('DOMContentLoaded', () => {
    fetch('nav.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById('sidebar-container').innerHTML = html;
  
        // 展开/折叠菜单
        document.querySelectorAll('.sidebar .menu-toggle').forEach(link => {
          const submenu = link.nextElementSibling;
          if (!submenu || submenu.tagName !== 'UL') return;
  
          link.addEventListener('click', e => {
            e.preventDefault();
            link.parentElement.classList.toggle('open');
          });
        });
  
        // 高亮当前菜单项
        const current = location.pathname.split('/').pop() || 'index.html';
        const activeLink = document.querySelector(`.sidebar a[href="${current}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          let li = activeLink.parentElement;
          while (li && li.classList) {
            li.classList.add('open');
            li = li.parentElement.closest('li');
          }
        }
      });
  });
  