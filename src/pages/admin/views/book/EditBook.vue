<template>
  <div class="container">
    <Card :padding="0">
      <div class="flex-container">
        <div class="panel">
          <div class="setting-main">

            <div class="section-title">封面</div>
            <Row type="flex" :gutter="30" justify="space-around">
              <Col :span="11">
                <Upload
                    type="drag"
                    class="mini-container"
                    accept=".jpg,.jpeg,.png,.bmp,.gif"
                    action=""
                    :before-upload="handleSelectFile"
                >
                  <div style="padding: 30px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399FF"></Icon>
                    <p>拖动图像，或者点击这里进行选择</p>
                  </div>
                </Upload>
              </Col>
              <Col :span="11">
                <img v-if="uploadImgSrc" :src="uploadImgSrc" height="130">
                <img v-else :src="formBook.coverImage" height="130">
              </Col>
            </Row>

            <div class="section-title">图书信息</div>
            <Form ref="formBook" :model="formBook" :rules="ruleBook">
              <Row type="flex" :gutter="30" justify="space-around">
                <Col :span="11">
                  <FormItem label="ISBN" prop="isbn">
                    <Input v-model="formBook.isbn" disabled></Input>
                  </FormItem>
                  <FormItem label="作者" prop="author">
                    <Input v-model="formBook.author"></Input>
                  </FormItem>
                  <FormItem label="出版社" prop="publisher">
                    <Input v-model="formBook.publisher"></Input>
                  </FormItem>
                  <FormItem label="库存" prop="stock" required>
                    <Input v-model="formBook.stock" :number="true"></Input>
                  </FormItem>
                </Col>
                <Col :span="11">
                  <FormItem label="书名" prop="title">
                    <Input v-model="formBook.title"></Input>
                  </FormItem>
                  <FormItem label="译者" prop="translator">
                    <Input v-model="formBook.translator"></Input>
                  </FormItem>
                  <FormItem label="页数" prop="pageNumber" required>
                    <Input v-model="formBook.pageNumber" :number="true"></Input>
                  </FormItem>
                  <Row type="flex" :gutter="30" justify="start">
                    <Col>
                      <FormItem label="出版年月" prop="publishDateTime" required>
                        <Date-picker type="date" placeholder="选择日期" v-model="formBook.publishDateTime"></Date-picker>
                      </FormItem>
                    </Col>
                    <Col>
                      <FormItem label="标签" prop="tags" required>
                        <span>
                          <Tag
                              v-for="tag in formBook.tags"
                              :key="tag"
                              :closable="true"
                              color="green"
                              @on-close="closeTag(tag)"
                          >
                            {{ tag }}
                          </Tag>
                        </span>
                        <Input
                            v-if="inputVisible"
                            v-model="tagInput"
                            ref="saveTagInput"
                            @on-enter="addTag"
                            @on-blur="addTag"
                        ></Input>
                        <Button v-else icon="ios-plus-empty" type="dashed" size="small" @click="showInput">
                          添加标签
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row type="flex" :gutter="30" justify="center">
                <Col :span="23">
                  <FormItem label="图书简介" prop="introduction">
                    <Simditor v-model="formBook.introduction" placeholder="图书简介"></Simditor>
                  </FormItem>
                  <FormItem label="作者简介" prop="authorIntroduction">
                    <Simditor v-model="formBook.authorIntroduction" placeholder="作者简介"></Simditor>
                  </FormItem>
                  <FormItem>
                    <Button type="primary" @click="editBook" :loading="loadingSaveBtn">保存</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import {
  checkBookExists,
  getBook,
  uploadCover,
  updateBook
} from "@/pages/admin/api";
import dayjs from "dayjs";
import Simditor from "@/pages/admin/components/Simditor";

export default {
  name: "EditBook",
  components: {
    Simditor: Simditor,
  },
  data() {
    const checkPageNumberValue = async(rule, value, callback) => {
      if (!this.formBook.pageNumber || this.formBook.pageNumber <= 0) {
        callback(new Error('页数必须大于0'));
      }
      else callback();
    };
    const checkStockValue = async(rule, value, callback) => {
      if (this.formBook.stock === null || this.formBook.stock === '' || this.formBook.stock < 0) {
        callback(new Error('库存必须大于等于0'));
      } else callback();
    };
    const checkPublishDateTime = async(rule, value, callback) => {
      if (this.formBook.publishDateTime) callback();
      else callback(new Error('请选择出版日期'));
    };
    return {
      formBook: {
        isbn: '',
        title: '',
        author: '',
        translator: '',
        publisher: '',
        publishDateTime: '',
        pageNumber: null,
        introduction: '',
        authorIntroduction: '',
        coverImage: '',
        stock: 0,
        tags: [],
      },
      inputVisible: false,
      loadingSaveBtn: false,
      tagInput: '',

      uploadImgSrc: '',

      ruleBook: {
        isbn: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入图书的ISBN号',
          },
          {
            pattern: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
            trigger: 'blur',
            message: '请输入正确的ISBN号',
          }
        ],
        title: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入书名',
          }
        ],
        author: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入作者',
          }
        ],
        publisher: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入出版社',
          }
        ],
        publishDateTime: [
          {
            validator: checkPublishDateTime,
            trigger: 'blur',
          }
        ],
        pageNumber: [
          {
            pattern: /^\d+$/,
            trigger: 'blur',
            message: '诚信值必须为整数',
          },
          {
            validator: checkPageNumberValue,
            trigger: 'blur',
          }
        ],
        stock: [
          {
            pattern: /^\d+$/,
            trigger: 'blur',
            message: '库存必须为整数',
          },
          {
            validator: checkStockValue,
            trigger: 'blur',
          }
        ]
      }
    }
  },
  methods: {
    checkFileType(file) {
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(file.name)) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: file.name + '的文件格式不正确，请选择图片'
        })
        return false
      }
      return true
    },
    checkFileSize(file) {
      if (file.size > 2 * 1024 * 1024) {
        this.$Notice.warning({
          title: '超出大小限制',
          desc: file.name + '超出大小限制，只能上传不超过2M的图片'
        })
        return false
      }
      return true
    },
    handleSelectFile(file) {
      let isOk = this.checkFileType(file) && this.checkFileSize(file);
      if (!isOk) {
        return false;
      }
      const _this = this;
      let reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        const fileBase64 = this.result;
        _this.uploadImgSrc = fileBase64;
      }
      return false;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    closeTag(tag) {
      this.formBook.tags.splice(this.formBook.tags.indexOf(tag), 1)
    },
    addTag() {
      let inputValue = this.tagInput;
      if (inputValue) {
        this.formBook.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.tagInput = '';
    },
    editBook() {
      this.$refs['formBook'].validate(async(valid) => {
        if (valid) {

          this.loadingSaveBtn = true;

          if (this.uploadImgSrc) {
            let byteString = null, baseData = this.uploadImgSrc;
            if (baseData.split(',')[0].indexOf('base64') >= 0) {
              byteString = atob(baseData.split(',')[1]);
            } else {
              byteString = unescape(baseData.split(',')[1]);
            }
            let mimeString = baseData.split(',')[0].split(':')[1].split(';')[0];
            let ia = new Uint8Array(byteString.length);
            for(let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            let blob = new Blob([ia], { type: mimeString });
            let form = new window.FormData();
            let fileName = this.formBook.isbn + '.png';
            let file = new window.File([blob], fileName);
            form.append('image', file);
            uploadCover('cover/' + fileName, file);
          }

          this.formBook.publishDateTime = dayjs(this.formBook.publishDateTime).format('YYYY-MM-DD');
          let editData = Object.assign({ }, this.formBook);
          await updateBook(this.formBook.isbn, editData).then(resEdit => {
            if (resEdit.status === 204) {
              this.$Message.success('保存成功');
              this.loadingSaveBtn = false;
              this.$router.push({
                name: 'book-list',
              })
            } else {
              this.$Message.error('保存失败');
            }
          });
          this.loadingSaveBtn = false;
        }
      })
    }
  },
  async mounted() {
    let isbn = this.$route.query.isbn;
    await checkBookExists(isbn).then(async resCheck => {
      if (resCheck.data === false) {
        this.$Message.error('该图书不存在');
        await this.$router.push({
          name: 'book-list'
        });
      } else {
        let resBook = await getBook(isbn);
        this.formBook = resBook.data;
      }
    })
  }
}
</script>

<style lang="less" scoped>
.inline {
  display: inline-block;
}

.copper-img {
  width: 400px;
  height: 300px;
}

.upload-modal {
  .notice {
    font-size: 16px;
    display: inline-block;
    vertical-align: top;
    padding: 10px 15px 10px 10px;
  }
  img {
    box-shadow: 0 0 1px 0;
    border-radius: 50%;
  }
}

@avatar-radius: 50%;

.container {
  width: 90%;
  min-width: 800px;
  margin: auto;
}

.flex-container {
  .menu {
    flex: 1 0 150px;
    max-width: 250px;
    .avatar-editor {
      padding: 10% 22%;
      margin-bottom: 10px;
      .avatar-container {
        &:hover {
          .avatar-mask {
            opacity: .5;
          }
        }
        position: relative;
        .avatar {
          width: 100%;
          height: auto;
          max-width: 100%;
          display: block;
          border-radius: @avatar-radius;
          box-shadow: 0px 0px 1px 0px;
        }
        .avatar-mask {
          transition: opacity .2s ease-in;
          z-index: 1;
          border-radius: @avatar-radius;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: black;
          opacity: 0;
          .mask-content {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 3;
            color: #fff;
            font-size: 16px;
            text-align: center;
            transform: translate(-50%, -50%);
            .text {
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

  .panel {
    flex: auto;
    &::before {
      content: '';
      display: block;
      width: 1px;
      height: 100%;
      background: #dddee1;
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 1;
    }
  }

  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 10px;
  .cropper-main {
    flex: none;
    .copper-img;
  }
  .cropper-btn {
    flex: none;
    vertical-align: top;
  }
  .cropper-preview {
    flex: none;
    margin-left: 20px;
    box-shadow: 0 0 1px 0;
    .copper-img;
  }
}

.ivu-menu-vertical.ivu-menu-light:after {
  width: 0;
}

.book-main {
  position: relative;
  margin: 10px 40px;
  padding-bottom: 20px;
  .book-content {
    margin-left: 20px;
  }
  .mini-container {
    width: 500px;
  }
}
</style>
