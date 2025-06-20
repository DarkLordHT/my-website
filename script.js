async function githubRequest(method, path, body) {
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${GITHUB_TOKEN}`
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
  async function getStudents() {
    try {
      // 读取文件内容 + sha（更新时需要）
      const res = await githubRequest('GET', `contents/${dataFilePath}?ref=${branch}`);
      const content = atob(res.content);
      const json = JSON.parse(content || '[]');
      return { list: json, sha: res.sha };
    } catch (e) {
      // 文件不存在则返回空
      return { list: [], sha: null };
    }
  }
  
  async function saveStudents(list, sha) {
    const content = btoa(JSON.stringify(list, null, 2));
    const body = {
      message: 'Update students data via site',
      content,
      branch,
      sha
    };
    return githubRequest('PUT', `contents/${dataFilePath}`, body);
  }
  
  /*****************************************************************
  * 2. 渲染 & 交互
  *****************************************************************/
  let students = [];
  let currentSha = null;
  
  async function initStudents() {
    const res = await getStudents();
    students = res.list;
    currentSha = res.sha;
    renderStudentList();
  }
  
  function renderStudentList() {
    const listEl = document.getElementById('student-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    students.forEach((stu, idx) => {
      const card = document.createElement('div');
      card.className = 'student-card';
      card.innerHTML = `
        <div class="student-num">${idx + 1}</div>
        <div class="student-info"><h3>${stu.name}</h3><p>${stu.major}</p></div>
        <div style="display:flex;align-items:center;">
          <img src="${stu.photo}" class="student-photo"/>
          <button class="delete-btn" data-id="${stu.id}">删除</button>
        </div>`;
      card.querySelector('.student-info').addEventListener('click', () => {
        location.href = `student_detail.html?id=${stu.id}`;
      });
      card.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm('确定删除?')) return;
        students = students.filter(s => s.id !== stu.id);
        await saveStudents(students, currentSha).then(r => currentSha = r.content.sha);
        renderStudentList();
      });
      listEl.appendChild(card);
    });
  }
  
  // ------ 添加学生 ------
  function setupAddModal() {
    const addBtn = document.getElementById('add-student-btn');
    const modal = document.getElementById('add-modal');
    const cancel = document.getElementById('cancel-add');
    const save = document.getElementById('save-student');
    addBtn && addBtn.addEventListener('click', () => modal.classList.add('open'));
    cancel && cancel.addEventListener('click', () => modal.classList.remove('open'));
  
    save && save.addEventListener('click', async () => {
      const name = document.getElementById('name-input').value.trim();
      const age  = Number(document.getElementById('age-input').value);
      const major= document.getElementById('major-input').value.trim();
      const file = document.getElementById('photo-input').files[0];
      if (!name || !major || !file) { alert('请填写所有字段并选择照片'); return; }
      const reader = new FileReader();
      reader.onload = async () => {
        const photoData = reader.result; // base64 Data URL
        const newStu = {
          id: Date.now(),
          name, age, major,
          bio: '',
          photo: photoData,
          note: ''
        };
        students.push(newStu);
        await saveStudents(students, currentSha).then(r => currentSha = r.content.sha);
        modal.classList.remove('open');
        renderStudentList();
      };
      reader.readAsDataURL(file);
    });
  }
  
  // ------ 学生详情页 ------
  function renderStudentDetail() {
    const detailEl = document.getElementById('student-detail');
    if (!detailEl) return;
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    const stu = students.find(s => s.id === id);
    if (!stu) { detailEl.innerHTML = '<p>学生不存在</p>'; return; }
  
    detailEl.innerHTML = `
      <div class="detail-wrapper">
        <div class="detail-header">
          <img src="${stu.photo}" alt="${stu.name}">
          <h2>${stu.name}</h2>
        </div>
        <p><strong>年龄：</strong>${stu.age}</p>
        <p><strong>专业：</strong>${stu.major}</p>
        <label>笔记</label>
        <textarea id="note-area" placeholder="填写对该学生的笔记...">${stu.note || ''}</textarea>
        <button id="save-note">保存笔记</button>
        <p><a href="student.html">← 返回列表</a></p>
      </div>`;
  
    document.getElementById('save-note').addEventListener('click', async () => {
      const note = document.getElementById('note-area').value;
      stu.note = note;
      await saveStudents(students, currentSha).then(r => currentSha = r.content.sha);
      alert('已保存');
    });
  }
  
  // ------ 初始化 ------
  document.addEventListener('DOMContentLoaded', () => {
    injectSidebar().then(async () => {
      await initStudents();
      renderStudentDetail();
      setupAddModal();
    });
  });
  