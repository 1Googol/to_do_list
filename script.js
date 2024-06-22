
(() => { 
    /* 状态变量 */
    let toDoListArray = [];

    /* ui 变量 */
    const form = document.querySelector(".form"); 
    const input = form.querySelector(".form_input");
    const ul = document.querySelector(".toDoList"); 

    window.onload = () => {
      displayTasks();
    };

    /* 显示储存的任务清单 */
    const displayTasks = () => {
      let tasks = [];

      // 从 localStorage 获取任务并存入数组
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let taskData = JSON.parse(localStorage.getItem(key));
        tasks.push({ key: key, value: taskData.value, completed: taskData.completed });
      }
      
      // 按时间戳对任务排序
      tasks.sort((a, b) => parseInt(a.key) - parseInt(b.key));

      /* 清楚当前显示内容 */
      const ul = document.querySelector(".toDoList");
      ul.innerHTML = '';
      
      /* 显示所有任务 */
      tasks.forEach(task => {
        addItemToDOM(task.key, task.value, task.completed);
      });
    };

    /* 更新任务列表 */
    const updateStorage = (index, taskValue, isCompleted = false) => {
      const taskData = {
        value: taskValue,
        completed: isCompleted
      };
      localStorage.setItem(index, JSON.stringify(taskData));
      displayTasks();
    };

    /* 事件监听 */
    form.addEventListener('submit', e => {
      /* 页面重新加载时防止默认行为 */
      e.preventDefault();
      /* 为项提供唯一 ID */
      let itemId = String(Date.now());
      /* 获取和分配输入值 */
      let toDoItem = input.value;
      /* 添加任务到本地储存 */
      updateStorage(itemId, toDoItem);
      /* 清除输入框 */
      input.value = '';
    });
    
    ul.addEventListener('click', e => {
      if (e.target.classList.contains('text')) {
        const li = e.target.closest('li');
        li.classList.toggle('completed');
        const id = li.getAttribute('data-id');
        const taskData = JSON.parse(localStorage.getItem(id));
        taskData.completed = li.classList.contains('completed');
        localStorage.setItem(id, JSON.stringify(taskData))
        // e.target.closest('li').classList.toggle('completed');
      } else if (e.target.tagName === 'BUTTON' || e.target.tagName == 'I') {
        let id = e.target.closest('li').getAttribute('data-id');
        if (!id) return 
        /* 移除任务显示 */
        removeItemFromDOM(id);
        // removeItemFromArray(id);
        /* 移除任务本地存储 */
        localStorage.removeItem(id)
      }
    });
    
    function addItemToDOM(itemId, toDoItem, isCompleted = false) {    
      
      /* 创建一个列表 */
      const li = document.createElement('li')
      li.setAttribute("data-id", itemId);
      
      if (isCompleted) {
        li.classList.add('completed')
      }

      /* 为文本添加类 */
      const textDiv = document.createElement('div');
      textDiv.classList.add('text');
      textDiv.innerText = toDoItem;
      li.appendChild(textDiv);

      /* 添加移除按钮 */
      const removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      li.appendChild(removeButton);

      /* 将 li 添加到 DOM */
      ul.appendChild(li);
    }
    
    function addItemToArray(itemId, toDoItem) {
      // 将项作为 ID 为的对象添加到数组中，以便以后可以查找和删除它
      toDoListArray.push({ itemId, toDoItem});
      console.log(toDoListArray)
    }
    
    function removeItemFromDOM(id) {
    
      // 按数据 ID 获取列表项
      var li = document.querySelector('[data-id="' + id + '"]');
      
      // 删除列表项
      ul.removeChild(li);
    }
    
    function removeItemFromArray(id) {
      
      // 创建一个新的 toDoListArray，包含所有与 ID 不匹配的列表
      toDoListArray = toDoListArray.filter(item => item.itemId !== id);
      console.log(toDoListArray);
    }
    
  })();