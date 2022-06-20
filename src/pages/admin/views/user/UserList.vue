<template>
  <div class="flex-container">
    <div id="main">
      <Panel shadow>
        <div slot="title">用户列表</div>
        <div slot="extra">
          <ul class="filter">
            <li v-if="selections.length">
              <Button type="success" icon="android-sync" @click="recoverUsers(selections)">启用</Button>
            </li>
            <li v-if="selections.length">
              <Button type="error" icon="android-delete" @click="disableUsers(selections)">禁用</Button>
            </li>
            <li>
              <Input v-model="query.userName" placeholder="用户名" @on-enter="getUserList"></Input>
            </li>
            <li>
              <Input v-model="query.keyWord" placeholder="学号、姓名..." @on-enter="getUserList"></Input>
            </li>
            <li>

            </li>
            <li>
              <Upload action="" accept=".xlsx" :before-upload="handleSelectFile">
                <Button type="info" icon="ios-cloud-upload-outline">导入用户</Button>
              </Upload>
            </li>
            <li>
              <Button type="info" icon="ios-download-outline" @click="exportUsers">导出用户</Button>
            </li>
          </ul>
        </div>
        <Table
            stripe
            :disabled-hover="true"
            :columns="columns"
            :data="users"
            :loading="loadingTable"
            @on-selection-change="selectionChange"
        ></Table>
        <Pagination
            :total="total"
            :page-size.sync="query.limit"
            @on-change="getUserList"
            @on-page-size-change="getUserList"
            :current.sync="query.page"
            :show-sizer="true"
        ></Pagination>
      </Panel>
    </div>
  </div>
</template>

<script>
import Panel from "@/pages/admin/components/Panel";
import Pagination from "@/pages/admin/components/Pagination";
import { readFileForWorkbook, analysisWorkbook, exportExcel } from "@/utils";
import {
  getUserCount,
  getUserList,
  getUserInfo,
  checkUserExists,
  disableUser,
  recoverUser,
  updatePassword,
  disableUsers,
  recoverUsers,
  importUsers,
} from "@/pages/admin/api";

export default {
  name: "UserList",
  components: {
    Panel: Panel,
    Pagination: Pagination,
  },
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 10,
          align: 'center'
        },
        {
          title: '用户名',
          align: 'center',
          key: 'userName',
        },
        {
          title: '学号',
          align: 'center',
          width: 150,
          render: (h, params) => {
            if (params.row.id) {
              return h('span', params.row.id);
            } else {
              return h('span', '---');
            }
          }
        },
        {
          title: '姓名',
          align: 'center',
          width: 100,
          render: (h, params) => {
            if (params.row.realName) {
              return h('span', params.row.realName);
            } else {
              return h('span', '---');
            }
          }
        },
        {
          title: '邮箱',
          align: 'center',
          width: 250,
          render: (h, params) => {
            return h('span', params.row.email);
          }
        },
        {
          title: '权限',
          align: 'center',
          width: 120,
          render: (h, params) => {
            if (params.row.role === 1) {
              return h('Tag', {
                props: {
                  color: 'gray'
                }
              }, '普通用户')
            } else if (params.row.role === 2) {
              return h('Tag', {
                props: {
                  color: 'yellow'
                }
              }, '管理员')
            } else {
              return h('Tag', {
                props: {
                  color: 'green'
                }
              }, '超级管理员')
            }
          }
        },
        {
          title: '性别',
          align: 'center',
          width: 60,
          render: (h, params) => {
            if (params.row.sex === 1) {
              return h('span', '男');
            } else if (params.row.sex === 2) {
              return h('span', '女');
            } else {
              return h('span', '---');
            }
          }
        },
        {
          title: '专业',
          align: 'center',
          render: (h, params) => {
            if (params.row.major) {
              return h('span', params.row.major);
            } else {
              return h('span', '---');
            }
          }
        },
        {
          title: '诚信值',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('span', params.row.integrity)
          }
        },
        {
          title: '状态',
          align: 'center',
          width: 80,
          render: (h, params) => {
            if (params.row.isDisabled === 0) {
              return h('Tag', {
                props: {
                  color: 'green'
                }
              }, '可用')
            } else {
              return h('Tag', {
                props: {
                  color: 'red'
                }
              }, '禁用')
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            if (params.row.role === 3 || this.selections.length) {
              return h('span', '---');
            } else {
              if (params.row.isDisabled) {
                return h('span', {
                  style: {
                    color: '#57a3f3',
                    cursor: 'pointer',
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      this.recoverUser(params.row.userName);
                    }
                  }
                }, '启用')
              } else {
                return h('div', [
                  h('span', {
                    style: {
                      color: '#57a3f3',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: 'profile-setting',
                          query: {
                            userName: params.row.userName,
                          },
                        })
                      }
                    }
                  }, '修改信息'),
                  h('span', {
                    style: {
                      color: '#57a3f3',
                      cursor: 'pointer',
                      marginLeft: '10px'
                    },
                    on: {
                      click: () => {
                        this.updatePassword(params.row.userName, '123456');
                      }
                    }
                  }, '重置密码'),
                  h('span', {
                    style: {
                      color: '#57a3f3',
                      cursor: 'pointer',
                      marginLeft: '10px'
                    },
                    on: {
                      click: () => {
                        this.disableUser(params.row.userName);
                      }
                    }
                  }, '禁用')
                ])
              }
            }
          }
        },
      ],
      loadingTable: false,
      users: [],
      selections: [],
      total: 0,
      query: {
        keyWord: '',
        userName: '',
        page: 1,
        limit: 10,
      },
    }
  },
  methods: {
    checkFileType(file) {
      if (!/\.(xlsx)$/.test(file.name)) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: file.name + '的文件格式不正确，请选择Excel文件'
        })
        return false
      }
      return true
    },
    checkFileSize(file) {
      if (file.size > 2 * 1024 * 1024) {
        this.$Notice.warning({
          title: '超出大小限制',
          desc: file.name + '超出大小限制，只能上传不超过2M的Excel文件'
        })
        return false
      }
      return true
    },
    selectionChange(selections) {
      this.selections = selections;
    },
    handleSelectFile(file) {
      let isOk = this.checkFileType(file) && this.checkFileSize(file);
      if (!isOk) {
        return false;
      }
      readFileForWorkbook(file).then(async (res) => {
        let resAnalysis = analysisWorkbook('json', res);
        let resImport = await importUsers(resAnalysis);
        if (resImport.status === 200) {
          this.$Message.success('导入成功');
          await this.getUserList();
        } else {
          this.$Message.error('导入失败');
        }
      })
      return false;
    },
    async exportUsers() {
      let resUsers = await getUserList(this.query.keyWord, 0, 0);
      exportExcel(resUsers.data);
    },
    async getUserList() {
      this.loadingTable = true;
      if (this.query.userName) {
        this.users = [];
        await checkUserExists(this.query.userName).then(async resCheck => {
          if (resCheck.data === true) {
            let resUser = await getUserInfo(this.query.userName);
            this.users.push(resUser.data);
            this.total = 1;
          } else {
            this.total = 0;
          }
        })
      } else {
        let resUserCount = await getUserCount(this.query.keyWord);
        let resUserList = await getUserList(this.query.keyWord, this.query.page, this.query.limit);
        this.total = resUserCount.data;
        this.users = resUserList.data;
      }
      for(let i = 0; i < this.users.length; i++) {
        this.users[i]._disabled = false;
        if (this.users[i].role === 3) {
          this.users[i]._disabled = true;
        }
      }
      this.loadingTable = false;
    },
    async disableUser(userName) {
      let resDisable = await disableUser(userName);
      if (resDisable.status === 204) {
        this.$Message.success('操作成功');
        await this.getUserList();
      } else {
        this.$Message.error('操作失败');
      }
    },
    async recoverUser(userName) {
      let resRecover = await recoverUser(userName);
      if (resRecover.status === 204) {
        this.$Message.success('操作成功');
        await this.getUserList();
      } else {
        this.$Message.error('操作失败');
      }
    },
    async disableUsers(userList) {
      let userNameList = new Array(userList.length);
      for (let i = 0; i < userList.length; i++) userNameList[i] = userList[i].userName;
      let resDisable = await disableUsers(userNameList);
      if (resDisable.status === 204) {
        this.$Message.success('操作成功');
        await this.getUserList();
      } else {
        this.$Message.error('操作失败');
      }
      this.selections = [];
    },
    async recoverUsers(userList) {
      let userNameList = new Array(userList.length);
      for (let i = 0; i < userList.length; i++) userNameList[i] = userList[i].userName;
      let resRecover = await recoverUsers(userNameList);
      if (resRecover.status === 204) {
        this.$Message.success('操作成功');
        await this.getUserList();
      } else {
        this.$Message.error('操作失败');
      }
      this.selections = [];
    },
    async updatePassword(userName, password) {
      let resUpdate = await updatePassword(userName, password);
      if (resUpdate.status === 200) {
        this.$Message.success('操作成功');
      } else {
        this.$Message.error('操作失败');
      }
    },
  },
  mounted() {
    this.query.userName = this.$route.query.userName;
    this.getUserList();
  }
}
</script>

<style lang="less" scoped>
.ivu-btn-text {
  color: #57a3f3;
}

.flex-container {
  #main {
    flex: auto;
    margin-right: 18px;
    .filter {
      margin-right: -10px;
    }
  }
  #contest-menu {
    flex: none;
    width: 210px;
  }
}

.modal {
  &-title {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
