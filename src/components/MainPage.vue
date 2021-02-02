<template>
  <div>
    <div class="page_header"><span class="page_title">Web记事本</span></div>
    <div class="book_container">
      <div class="book_buttons">
        <el-button type="success" v-on:click="addBookClick" size="mini" round>新增</el-button>
      </div>
      <div>
        <div class="book_item" v-for="book in bookList" v-on:click="listTitle(book.id)">{{ book.name }}</div>
      </div>
    </div>
    <div class="title_container">
      <div class="title_buttons">
        <el-button v-if="currentBookId!=''" type="success" v-on:click="addTitleClick" size="mini" round>新增</el-button>
      </div>
      <div>
        <div class="title_item" v-for="title in titleList">{{ title.name }}</div>
      </div>
    </div>
    <div class="document_container">
      <div id="content_editor">

      </div>
    </div>
  </div>
</template>

<style scoped>
.page_header {
  position: fixed;
  background-color: #333;
  color: #fff;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  z-index: 100;
}

.page_title {
  margin-left: 10px;
}

.book_container {
  position: fixed;
  background-color: #ddd;
  height: 100%;
  width: 300px;
  overflow-y: scroll;
}

.title_container {
  position: fixed;
  background-color: #eee;
  height: 100%;
  width: 300px;
  margin-left: 300px;
  overflow-y: scroll;
}

.document_container {
  padding-top: 60px;
  padding-left: 610px;
  padding-right: 10px;
}

.book_buttons {
  margin-top: 60px;
  margin-bottom: 10px;
  text-align: center;
}

.book_item {
  border-top: 1px solid #fff;
  padding-left: 10px;
  color: #3a8835;
  height: 40px;
  line-height: 40px;
}

.book_item:hover {
  cursor: pointer;
  background-color: #ccc;
}

.title_buttons {
  margin-top: 60px;
  margin-bottom: 10px;
  text-align: center;
}

.title_item {
  border-top: 1px solid #666;
  padding-left: 10px;
  color: #d96906;
  height: 40px;
  line-height: 40px;
}

.title_item:hover {
  cursor: pointer;
  background-color: #eee;
}
</style>

<script>
import NetUtils from "../utils/netUtils";
import {ElMessage} from "element-plus";
import E from 'wangeditor'

export default {
  name: "MainPage",
  mounted() {
    this.token = localStorage.getItem("token");

    const editor = new E('#content_editor')
    editor.config.height = 800
    editor.create()


    this.listBook();
  },
  data() {
    return {
      token: "",
      bookList: [],
      currentBookId:"",
      titleList:[],
    };
  },
  methods: {
    listBook() {
      NetUtils.get(this, "/noteBook/list?token=" + this.token, (result) => {
        if (result.code == 0) {
          this.bookList = result.data;
        } else {
          ElMessage(result.error);
        }
      });
    },
    listTitle(bookId){
      this.currentBookId = bookId;
      NetUtils.get(this, "/title/list?token=" + this.token+"&noteBookId="+this.currentBookId, (result) => {
        if (result.code == 0) {
          this.titleList = result.data;
        } else {
          ElMessage(result.error);
        }
      });
    },
    addBookClick() {
      this.$prompt('输入记事本名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        let noteBook = {
          name: value
        }
        NetUtils.post(this, "/noteBook/set?token=" + this.token, (result) => {
          if (result.code == 0) {
            this.listBook();
          } else {
            ElMessage(result.error);
          }
        }, noteBook);
      });
    },
    addTitleClick() {
      this.$prompt('输入文档名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        let title = {
          noteBookId:this.currentBookId,
          name: value
        }
        NetUtils.post(this, "/title/set?token=" + this.token+"&noteBookId="+this.currentBookId, (result) => {
          if (result.code == 0) {
            this.listTitle(this.currentBookId)
          } else {
            ElMessage(result.error);
          }
        }, title);
      });
    }
  }
};
</script>
