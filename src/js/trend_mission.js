const editButtons = document.querySelectorAll('.edit-button');
const editForms = document.querySelectorAll('.edit-form');
const commentContents = document.querySelectorAll('.comment-content');
const commentButtons = document.querySelectorAll('.comment-buttons');
const editTextareas = document.querySelectorAll('.edit-textarea');


editButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    editForms[index].classList.toggle('hidden');
    commentContents[index].classList.toggle('hidden');
    commentButtons[index].classList.toggle('hidden');

    // 기존 댓글 내용을 수정할 수 있는 입력 필드에 채워 넣음
    const existingComment = commentContents[index].textContent.trim();
    editTextareas[index].value = existingComment;
  });
});




// url값 가져오기
const urlParams = new URLSearchParams(window.location.search);
const trendMissionId = urlParams.get('trend_mission_id');
const trendName = urlParams.get('trend_name');
const pageUserId = urlParams.get('user_id');


// 좋아요 버튼을 가져옵니다.
const likeButton = document.querySelector('.like-button');

// 하트를 가져옵니다.
const heart = document.querySelector('.heart');

// 좋아요 버튼 클릭 여부를 저장하는 변수입니다.
let isLiked = false;

// 스탬프 버튼을 가져옵니다.
const stampButton = document.getElementById('stamp-btn');


// 트렌드 미션 페이지의 제목을 가져옵니다.
const trendMissionTheme = document.querySelector('.trend-theme');
trendMissionTheme.textContent = trendName;


// 트렌드 미션 페이지 정보를 가져옵니다.
fetch(BASEURL + '/trend-missions/about/' + trendMissionId, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)

      // 트렌드에 해당하는 아이템들을 가져옵니다.
      const trendMissionItems = data.trend_item_list;

      const trendItems = document.querySelector('.trend-items');
      for (let i = 0; i < trendMissionItems.length; i++) {
        
        // <li> 요소를 생성합니다.
        const listItem = document.createElement('li');
        listItem.classList.add('trend-item');

        // <a> 요소를 생성합니다.
        const link = document.createElement('a');
        link.href = './trend_mission_detail.html?trend_mission_item_id=' + trendMissionItems[i].id;

        // <div> 요소를 생성합니다.
        const div = document.createElement('div');
        if (trendMissionItems[i].image == null) {
          div.classList.add('trend-item-image');  
        }else{
          const image = document.createElement('img');
          image.src = BASEURL + trendMissionItems[i].image;
          div.classList.add('trend-item-image');  
          div.appendChild(image);
        }
        

        // <p> 요소를 생성합니다.
        const paragraph = document.createElement('p');
        paragraph.textContent = trendMissionItems[i].trend_item_name;

        // <div> 요소를 <a> 요소의 하위 요소로 추가합니다.
        link.appendChild(div);

        // <p> 요소를 <a> 요소의 하위 요소로 추가합니다.
        link.appendChild(paragraph);

        // <a> 요소를 <li> 요소의 하위 요소로 추가합니다.
        listItem.appendChild(link);
        trendItems.appendChild(listItem);

      }
      // 모든 미션 완수했는지(스탬프 버튼 활성화) 확인
      if (data.is_all_certificated) { // 모든 미션 완수한 경우 버튼 활성화
        stampButton.disabled = false;
      }


      // 조회수 표시
      const viewCount = document.getElementById('viewCount');
      viewCount.textContent = data.view_count;

      // 좋아요 수 표시
      const likeCount = document.getElementById('likeCount');
      likeCount.textContent = data.like_list.length;

      // 좋아요 확인
      // 이미 좋아요 한 경우 하트를 빨간색으로 채웁니다.

      // 접속중인 사용자 확인
      fetch(BASEURL + '/users/info', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(response => response.json())
        .then(userData => {
          userId = userData.user_id;
          // 좋아요 목록 가져오기
          const likeList = data.like_list;

          // 접속자가 이미 좋아요 했는지 체크
          for (let i = 0; i < likeList.length; i++) {
            if (userId == likeList[i].user) {
                isLiked = true;
                heart.style.fill = '#D7433A';
            } 
          }

          // 접속자가 페이지 주인과 다르면 스탬프 버튼 삭제
          if (userId != pageUserId) {
            stampButton.remove();
          }

          //댓글 수 표시
          const commentCount = document.getElementById('commentCount');
          commentCount.textContent = data.comment_list.length;

          // 댓글 데이터 가져오기
          const commentList = data.comment_list;

          // 댓글 
          const commentsViewClass = document.querySelector('.comments-view');
          

          for (let i = 0; i < commentList.length; i++) {
            // 댓글인지 대댓글인지 확인
            if (commentList[i].parent_comment == null) { // 댓글인 경우
              // <li> 요소를 생성합니다.
              const commentItem = document.createElement('li');
              commentItem.classList.add('comment');
              commentItem.id = 'comment-id-' + commentList[i].id;

              // user name, date
              const commentP = document.createElement('p');
              const userName = document.createElement('span');
              userName.classList.add('user-name');
              userName.textContent = commentList[i].user_nickname;

              const date = document.createElement('small');
              const originalDate = commentList[i].created_at;
              const parsedDate = new Date(originalDate);
              const formattedDate = `${parsedDate.getFullYear()}.${parsedDate.getMonth() + 1}.${parsedDate.getDate()}`;
              date.textContent = formattedDate;

              commentP.appendChild(userName);
              commentP.appendChild(date);

              // content
              const commentContent = document.createElement('p');
              commentContent.classList.add('comment-content');
              commentContent.textContent = commentList[i].content;

              // 작성자 이름, 댓글 내용 넣어주기
              commentItem.appendChild(commentP);
              commentItem.appendChild(commentContent);

              const commentButtons = document.createElement('div');
              commentButtons.classList.add('comment-buttons');

              // 댓글인 경우에만 대댓글 작성 버튼 생성
              const replyButton = document.createElement('button');
              replyButton.classList.add('reply-button');
              replyButton.textContent = '대댓글';
              commentButtons.appendChild(replyButton);
              

              // 대댓글 작성 form 생성
              const replyForm = document.createElement('form');
              //editForm.classList.add('dynamic-edit-form');
              replyForm.classList.add('reply-form');
              replyForm.classList.add('hidden');
              replyForm.id = 'reply-form-id-' + commentList[i].id;

              const replyTextarea = document.createElement('textarea');
              replyTextarea.classList.add('reply-textarea');          
              replyTextarea.placeholder = '대댓글을 작성하세요...';

              const replySubmitButton = document.createElement('button');
              replySubmitButton.type = 'submit';
              replySubmitButton.classList.add('btn');
              replySubmitButton.textContent = '저장';

              replyForm.appendChild(replyTextarea);
              replyForm.appendChild(replySubmitButton);

              commentItem.appendChild(replyForm);


              // 댓글 작성자와 접속자가 같은 경우 수정 삭제 버튼 생성
              if (commentList[i].user == userId) {
            
                

                const editButton = document.createElement('button');
                editButton.classList.add('edit-button');
                editButton.textContent = '수정';

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.id = 'delete-button-id-' + commentList[i].id;
                deleteButton.textContent = '삭제';
                
                // 생성한 수정 삭제 버튼 넣어주기
                commentButtons.appendChild(editButton);
                commentButtons.appendChild(deleteButton);
                //commentButtons.appendChild(replyButton);

                // 수정 버튼 클릭 시 수정 폼 활성화
                const editForm = document.createElement('form');
                //editForm.classList.add('dynamic-edit-form');
                editForm.classList.add('edit-form');
                editForm.classList.add('hidden');
                editForm.id = 'edit-form-id-' + commentList[i].id;

                const editTextarea = document.createElement('textarea');
                editTextarea.classList.add('edit-textarea');          
                editTextarea.placeholder = '댓글을 수정하세요...';
      
                const editSubmitButton = document.createElement('button');
                editSubmitButton.type = 'submit';
                editSubmitButton.classList.add('btn');
                editSubmitButton.textContent = '저장';

                editForm.appendChild(editTextarea);
                editForm.appendChild(editSubmitButton);


                // 위에서 생성한 요소 전부 넣어주기
                commentItem.appendChild(commentButtons);
                commentItem.appendChild(editForm);
                
                
              }
              // 최종 댓글 요소에 줄바꿈 넣어주기
              const hr = document.createElement('hr');
              commentItem.appendChild(hr);

              // 최종 댓글 요소 넣어주기
              commentsViewClass.appendChild(commentItem);
              
            }
            // 대댓글의 경우
            else {
              // 최종적으로 넣어줄 부모 댓글 요소  
              const parentComment = document.getElementById('comment-id-' + commentList[i].parent_comment);
              
              // <ul> 요소를 생성합니다.
              const replyCommentClass = document.createElement('ul');
              replyCommentClass.classList.add('replys');
              replyCommentClass.id = 'comment-id-' + commentList[i].id;
              
              // <li> 요소를 생성합니다.
              const replyCommentItem = document.createElement('li');
              replyCommentItem.classList.add('reply');

              // user name, date 처리
              const commentP = document.createElement('p');
              const userName = document.createElement('span');
              userName.classList.add('user-name');
              userName.textContent = commentList[i].user_nickname;

              const date = document.createElement('small');
              const originalDate = commentList[i].created_at;
              const parsedDate = new Date(originalDate);
              const formattedDate = `${parsedDate.getFullYear()}.${parsedDate.getMonth() + 1}.${parsedDate.getDate()}`;
              date.textContent = formattedDate;

              commentP.appendChild(userName);
              commentP.appendChild(date);

              // content
              const commentContent = document.createElement('p');
              commentContent.classList.add('comment-content');
              commentContent.textContent = commentList[i].content;

              // 작성자 이름, 댓글 내용 넣어주기
              replyCommentItem.appendChild(commentP);
              replyCommentItem.appendChild(commentContent);

              // 대댓글 작성자와 접속자가 같은 경우 수정 삭제 버튼 생성
              if (commentList[i].user == userId) {
                const commentButtons = document.createElement('div');
                commentButtons.classList.add('comment-buttons');

                const editButton = document.createElement('button');
                editButton.classList.add('edit-button');
                editButton.textContent = '수정';

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.id = 'delete-button-id-' + commentList[i].id;
                deleteButton.textContent = '삭제';
                
                // 생성한 수정 삭제 버튼 넣어주기
                commentButtons.appendChild(editButton);
                commentButtons.appendChild(deleteButton);

                // 수정 버튼 클릭 시 수정 폼 활성화
                const editForm = document.createElement('form');
                editForm.classList.add('edit-form');
                editForm.classList.add('hidden');
                editForm.id = 'edit-form-id-' + commentList[i].id;

                const editTextarea = document.createElement('textarea');
                editTextarea.classList.add('edit-textarea');
                editTextarea.placeholder = '댓글을 수정하세요...';
                
                const editSubmitButton = document.createElement('button');
                editSubmitButton.classList.add('btn');
                editSubmitButton.type = 'submit';
                editSubmitButton.textContent = '저장';

                editForm.appendChild(editTextarea);
                editForm.appendChild(editSubmitButton);


                // 위에서 생성한 요소 전부 넣어주기
                replyCommentItem.appendChild(commentButtons);
                replyCommentItem.appendChild(editForm);            
              }
              // 최종 대댓글 요소 넣어주기
              replyCommentClass.appendChild(replyCommentItem);

              // 최종 댓글 요소에 줄바꿈 넣어주기
              const hr = document.createElement('hr');
              replyCommentClass.appendChild(hr);
            
              //부모 요소에 대댓글 요소 넣어주기
              parentComment.appendChild(replyCommentClass);
            }
        }
        
      });



      

    // 대댓글 작성 버튼에 대한 함수 재할당
    const replyButtons = document.querySelectorAll('.reply-button');
    const replyForms = document.querySelectorAll('.reply-form');
    const replyCommentButtons = document.querySelectorAll('.reply-buttons');

    replyButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        replyForms[index].classList.toggle('hidden');
        //replyCommentButtons[index].classList.toggle('hidden');

      });
    });


    // 댓글 모두 로드 완료,,,
    // 댓글 수정 버튼에 대한 함수 재할당
    const editButtons = document.querySelectorAll('.edit-button');
    const editForms = document.querySelectorAll('.edit-form');
    const commentContents = document.querySelectorAll('.comment-content');
    const commentButtons = document.querySelectorAll('.comment-buttons');
    const editTextareas = document.querySelectorAll('.edit-textarea');


    editButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        editForms[index].classList.toggle('hidden');
        commentContents[index].classList.toggle('hidden');
        commentButtons[index].classList.toggle('hidden');
      });
    });

  

    // 로드 된 댓글들에 대한 삭제, 수정 할당

    // 댓글 삭제
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const commentId = button.id.split('-')[3];
        fetch(`${BASEURL}/trend-missions/comments`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              "comment_id": commentId
            }),
          credentials: 'include',
          
        })
        .then(response => response.json())
        .then(data => {
          // 댓글 삭제 성공 시 페이지 새로고침
          window.location.reload();
        });
      });
    });

    // 댓글 수정
    editForms.forEach((form, index) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const commentId = form.id.split('-')[3];
        const commentValue = editTextareas[index].value;

        fetch(`${BASEURL}/trend-missions/comments`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(
            {
            'comment_id': commentId,
            'content': commentValue
            }),
          
        })
        .then(response => response.json())
        .then(data => {
          // 댓글 수정 성공 시 페이지 새로고침
          window.location.reload();
        });
      });
    });

    // 대댓글 작성
    replyForms.forEach((form, index) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const commentId = form.id.split('-')[3];
        const commentValue = form.querySelector('.reply-textarea').value;

        fetch(`${BASEURL}/trend-missions/comments/${commentId}/replies`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(
            {
            'content': commentValue
            }),
          
        })
        .then(response => response.json())
        .then(data => {
          // 대댓글 작성 성공 시 페이지 새로고침
          window.location.reload();
        });
      });

    });



});

      

// 좋아요 버튼에 클릭 이벤트 리스너를 설정합니다.
likeButton.addEventListener('click', function () {
  // 좋아요 버튼 클릭 여부에 따라 카운트를 증가시키거나 감소시킵니다.
  let currentCount = Number(likeCount.innerText);
  if (!isLiked) {
    likeCount.innerText = currentCount + 1;
    heart.style.fill = '#D7433A'; // 하트를 빨간색으로 채웁니다.

    // 좋아요 요청 api 호출
    fetch(BASEURL + '/trend-missions/' + trendMissionId+ '/like', {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

  } else {
    likeCount.innerText = currentCount - 1;
    heart.style.fill = 'none'; // 하트를 원래대로 돌립니다.

    // 좋아요 취소 api 호출
    fetch(BASEURL + '/trend-missions/' + trendMissionId+ '/like', {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
  }
  // 좋아요 버튼 클릭 여부를 업데이트합니다.
  isLiked = !isLiked;
});


// 스탬프 버튼에 클릭 이벤트 리스너를 설정합니다.
stampButton.addEventListener('click', function () {

  // 스탬프 발급 api 호출
  fetch(BASEURL+'/trend-missions/' + trendMissionId+ '/complete', {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access_tokens'),
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  .then(response => response.json())
  .then(data => {
    if (data == '이미 스탬프를 발급받았습니다.') {
      alert('이미 스탬프를 발급받았습니다!');
      window.location.href = './my_stamp.html?user_id=' + userId;
    } else{
      alert('스탬프가 발급되었습니다!');
      window.location.href = './my_stamp.html?user_id=' + userId;
    }
  });
});


// 댓글 작성
const commentForm = document.querySelector('.comment-form');

document.getElementById('comment-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const commentValue= document.querySelector('.comment-textarea').value;
    
    fetch(`${BASEURL}/trend-missions/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(
        {
        'trend_mission': trendMissionId,
        'content': commentValue
        }),
      
    })
    .then(response => response.json())
    .then(data => {
      // 댓글 작성 성공 시 페이지 새로고침
      window.location.reload();
    });
});




