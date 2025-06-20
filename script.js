// script.js
document.addEventListener('DOMContentLoaded', () => {
    // ① 把 nav.html 注入到 #sidebar-container
    fetch('nav.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById('sidebar-container').innerHTML = html;
  
        // ② 点击含子菜单的链接时，只展开/折叠，不导航
        document.querySelectorAll('.sidebar li > a').forEach(link => {
          const submenu = link.nextElementSibling;
          if (!submenu) return;                     // 叶节点无 submenu
          link.addEventListener('click', e => {
            e.preventDefault();                    // 阻止跳转
            link.parentElement.classList.toggle('open');
          });
        });
  
        // ③ 根据当前文件名，高亮对应菜单 & 展开父级
        const current = location.pathname.split('/').pop() || 'index.html';
        const activeLink = document.querySelector(`.sidebar a[href="${current}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          let li = activeLink.parentElement;
          while (li && li.classList) {
            li.classList.add('open');              // 展开到根节点
            li = li.parentElement.closest('li');
          }
        }
      });
  });
  