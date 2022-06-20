<template>
  <div class="setting-main">
    <div class="section-title">头像设置</div>
    <template v-if="!avatarOption.imgSrc">
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
    </template>
    <template v-else>
      <div class="flex-container">
        <div class="cropper-main inline">
          <VueCropper
              ref="cropper"
              autoCrop
              fixed
              :autoCropWidth="200"
              :autoCropHeight="200"
              :img="avatarOption.imgSrc"
              :outputSize="avatarOption.size"
              :outputType="avatarOption.outputType"
              :info="true"
              @realTime="realTime"
          ></VueCropper>
        </div>
        <ButtonGroup vertical class="cropper-btn">
          <Button @click="rotate('left')">
            <Icon type="arrow-return-left" size="20"></Icon>
          </Button>
          <Button @click="rotate('right')">
            <Icon type="arrow-return-right" size="20"></Icon>
          </Button>
          <Button @click="reselect">
            <Icon type="refresh" size="20"></Icon>
          </Button>
          <Button @click="finishCrop">
            <Icon type="checkmark-round" size="20"></Icon>
          </Button>
        </ButtonGroup>
        <div class="cropper-preview" :style="previewStyle">
          <div :style="preview.div">
            <img :src="avatarOption.imgSrc" :style="preview.img">
          </div>
        </div>
      </div>
    </template>
    <Modal v-model="uploadModalVisible" title="上传头像">
      <div class="upload-modal">
        <p class="notice">你的头像将设置为：</p>
        <img :src="uploadImgSrc">
      </div>
      <div slot="footer">
        <Button @click="uploadAvatar" :loading="loadingUploadBtn">上传</Button>
      </div>
    </Modal>

    <div class="section-title">个人信息设置</div>
    <Form ref="formProfile" :model="formProfile" :rules="ruleProfile">
      <Row type="flex" :gutter="30" justify="space-around">
        <Col :span="11">
          <FormItem label="学号" prop="id">
            <Input v-model="formProfile.id"></Input>
          </FormItem>
          <FormItem label="姓名">
            <Input v-model="formProfile.realName"></Input>
          </FormItem>
          <Form-item>
            <Button type="primary" @click="updateProfile" :loading="loadingSaveBtn">保存</Button>
          </Form-item>
        </Col>
        <Col :span="11">
          <FormItem label="性别">
            <Select v-model="formProfile.sex">
              <Option :value="1">男</Option>
              <Option :value="2">女</Option>
            </Select>
          </FormItem>
          <FormItem label="专业">
            <Input v-model="formProfile.major"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { VueCropper } from 'vue-cropper'
import { nanoid } from 'nanoid'
import {
  updateUserInfo,
  uploadAvatar,
  updateAvatar
} from "@/pages/user/api";

export default {
  name: "ProfileSetting",
  components: {
    VueCropper: VueCropper,
  },
  data() {
    return {
      loadingSaveBtn: false,
      loadingUploadBtn: false,
      uploadModalVisible: false,
      preview: { },
      uploadImgSrc: '',
      avatarOption: {
        imgSrc: '',
        size: 0.8,
        outputType: 'png',
      },
      formProfile: {
        id: '',
        realName: '',
        email: '',
        role: '',
        avatarImage: '',
        sex: 0,
        major: '',
        integrity: '',
      },
      ruleProfile: {
        id: [
          {
            pattern: /^[1-9][0-9]{9}$/,
            trigger: 'blur',
            message: '请输入正确的学号',
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['user']),
    previewStyle() {
      return {
        'width': this.preview.w + 'px',
        'height': this.preview.h + 'px',
        'overflow': 'hidden'
      }
    }
  },
  methods: {
    ...mapActions('user', ['setUser', 'initUser']),
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
      let reader = new window.FileReader()
      reader.onload = (e) => {
        this.avatarOption.imgSrc = e.target.result;
      }
      reader.readAsDataURL(file);
      return false;
    },
    realTime(data) {
      this.preview = data;
    },
    rotate(direction) {
      if(direction === 'left') {
        this.$refs.cropper.rotateLeft();
      } else {
        this.$refs.cropper.rotateRight()
      }
    },
    reselect() {
      this.$Modal.confirm({
        content: '你确定要放弃更改吗？',
        onOk: () => {
          this.avatarOption.imgSrc = ''
        }
      })
    },
    finishCrop() {
      this.$refs.cropper.getCropData(data => {
        this.uploadImgSrc = data;
        this.uploadModalVisible = true;
      })
    },
    uploadAvatar() {
      this.$refs.cropper.getCropBlob(async blob => {
        let form = new window.FormData();
        let fileName = nanoid() + '.' + this.avatarOption.outputType;
        let file = new window.File([blob], fileName);
        form.append('image', file);
        this.loadingUploadBtn = true;
        uploadAvatar('avatar/' + fileName, file);
        let resUpdateAvatar = await updateAvatar(this.user.userName, fileName);
        this.$Message.success('上传成功');
        this.avatarOption.imgSrc = '';
        this.setUser(resUpdateAvatar.data);
        this.initFormProfile();
        this.loadingUploadBtn = false;
        this.uploadModalVisible = false;
      })
    },
    updateProfile() {
      this.$refs['formProfile'].validate(async(valid) => {
        if (valid) {
          this.loadingSaveBtn = true;
          let updateData = Object.assign({ }, this.formProfile);
          let resUpdate = await updateUserInfo(this.user.userName, updateData);
          if (resUpdate.status === 200) {
            this.$Message.success('保存成功');
            this.setUser(resUpdate.data);
          } else {
            this.$Message.error('保存失败');
          }
          this.loadingSaveBtn = false;
        }
      })
    },
    initFormProfile() {
      Object.keys(this.formProfile).forEach(element => {
        this.formProfile[element] = this.user[element];
      })
    },
  },
  mounted() {
    this.initFormProfile();
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

.flex-container {
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
</style>
