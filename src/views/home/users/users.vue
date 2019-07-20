<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜素区域行 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="users" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" :enterable="false" content="分配角色" placement="top">
              <el-button type="info" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加用户表单部分 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 验证邮箱的规则
const checkEmail = (rule, value, cb) => {
  // 验证邮箱的正则表达式
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

  if (regEmail.test(value)) {
    // 合法的邮箱
    return cb()
  }
  cb(new Error('请输入合法的邮箱'))
}

// 验证手机号的规则
const checkMobile = (rule, value, cb) => {
  // 验证手机号的正则表达式
  const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

  if (regMobile.test(value)) {
    return cb()
  }

  cb(new Error('请输入合法的手机号'))
}

export default {
  data: () => ({
    addDialogVisible: false,
    editDialogVisible: false,
    users: [],
    total: 0,

    //查询用户信息获得的数据
    queryInfo: {
      query: '',
      //当前页数
      pagenum: 1,
      // list amount of each page
      pagesize: 2
    },

    // 添加用户表单信息
    addForm: {
      username: '',
      password: '',
      email: '',
      phone: ''
    },

    // 编辑用户信息表单信息
    editForm: {
      username: '',
      email: '',
      phone: ''
    },

    //添加用户表单验证规则
    addFormRules: {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
          min: 3,
          max: 10,
          message: '用户名的长度在3~10个字符之间',
          trigger: 'blur'
        }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
          min: 6,
          max: 15,
          message: '用户名的长度在6~15个字符之间',
          trigger: 'blur'
        }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
      ],
      mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
      ]
    },

    //编辑用户信息表单验证规则
    editFormRules: {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
          min: 3,
          max: 10,
          message: '用户名的长度在3~10个字符之间',
          trigger: 'blur'
        }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
      ],
      mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
      ]
    }
  }),

  //声明周期钩子函数
  created() {
    this.getUsers()
  },

  // methods
  methods: {
    // 获取所有用户功能
    async getUsers() {
      const {
        data: { data, meta }
      } = await this.$http.get('users', { params: this.queryInfo })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.users = data.users
      this.total = data.total
      //console.log(data)
    },

    // 监听pagesize 改变触发的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUsers()
    },
    // 监听页码值 改变触发的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUsers()
    },

    // 用户状态修改功能
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    // 填加用户功能
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)

        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUsers()
      })
    },

    // 编辑用户信息表单
    async showEditDialog(id) {
      this.editDialogVisible = true
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    //发送请求编辑用户信息
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        if (res.meta.status !== 201) {
          this.$message.error('修改用户信息失败！')
        }
        this.$message.success('修改用户信息成功！')
        // 隐藏编辑用户的对话框
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getUsers()
      })
    },

    // 发送请求删除用户功能
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.getUsers()
    }
  }
}
</script>
<style lang="less" scoped>
</style>