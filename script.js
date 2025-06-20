// 数据示例，可自行替换/扩展
const studentsData = [
    {
      id: 1,
      name: 'Alice Tan',
      age: 20,
      major: 'Computer Science',
      bio: '喜欢编程与设计。',
      photo: 'https://via.placeholder.com/120x120.png?text=Alice'
    },
    {
      id: 2,
      name: 'Benjamin Lee',
      age: 21,
      major: 'Mathematics',
      bio: '热爱数字与逻辑。',
      photo: 'https://via.placeholder.com/120x120.png?text=Ben'
    },
    {
      id: 3,
      name: 'Chloe Lim',
      age: 19,
      major: 'Physics',
      bio: '对宇宙充满好奇。',
      photo: 'https://via.placeholder.com/120x120.png?text=Chloe'
    }
  ];
  
  // -------------- 公共：注入侧边栏 & 菜单逻辑 --------------
  function injectSidebar() {
    return fetch('nav.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById('sidebar-container').innerHTML = html;
  
        document.querySelectorAll('.sidebar .menu-toggle').forEach(link => {
          const submenu = link.nextElementSibling;
          if (!submenu || submenu.tagName !== 'UL') return;
          link.addEventListener('click', e => {
            e.preventDefault();
            link.parentElement.classList.toggle('open');
          });
        });
  
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
  }

  // -------------- 学生列表渲染 --------------
function renderStudentList() {
    const listEl = document.getElementById('student-list');
    if (!listEl) return; // 不在 student.html 时跳过
  
    studentsData.forEach((stu, idx) => {
      const card = document.createElement('div');
      card.className = 'student-card';
      card.innerHTML = `
        <div class="student-num">${idx + 1}</div>
        <div class="student-info">
          <h3>${stu.name}</h3>
          <p>${stu.major}</p>
        </div>
        <img src="${stu.photo}" alt="${stu.name}" class="student-photo" />
      `;
      card.addEventListener('click', () => {
        location.href = `student_detail.html?id=${stu.id}`;
      });
      listEl.appendChild(card);
    });
  }
  
  // -------------- 学生详情渲染 --------------
  function renderStudentDetail() {
    const detailWrapper = document.getElementById('student-detail');
    if (!detailWrapper) return; // 不在详情页
  
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    const stu = studentsData.find(s => s.id === id);
    if (!stu) {
      detailWrapper.innerHTML = '<p>学生不存在。</p>';
      return;
    }
    detailWrapper.innerHTML = `
      <div class="detail-wrapper">
        <div class="detail-header">
          <img src="${stu.photo}" alt="${stu.name}" />
          <h2>${stu.name}</h2>
        </div>
        <p><strong>年龄：</strong> ${stu.age}</p>
        <p><strong>专业：</strong> ${stu.major}</p>
        <p>${stu.bio}</p>
        <p><a href="student.html">← 返回列表</a></p>
      </div>
    `;
  }
  
  // -------------- 初始化 --------------
  document.addEventListener('DOMContentLoaded', () => {
    injectSidebar().then(() => {
      renderStudentList();
      renderStudentDetail();
    });
  });
  