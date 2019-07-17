<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="./heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744 "
          text-color="#fff"
          active-text-color="#09f"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id+''" v-for="menu in menus" :key="menu.id">
            <template slot="title">
              <i :class="iconObj[menu.id]"></i>
              <span>{{menu.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item-group>
              <template slot="title"></template>
              <el-menu-item
                :index="subMenu.id+''"
                v-for="subMenu in menu.children"
                :key="subMenu.id"
              >
                <i class="el-icon-menu"></i>
                {{subMenu.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data: () => ({
    menus: [],
    iconObj: {
      '125': 'iconfont icon-user',
      '103': 'iconfont icon-tijikongjian',
      '101': 'iconfont icon-shangpin',
      '102': 'iconfont icon-danju',
      '145': 'iconfont icon-baobiao'
    },
    isCollapse: false
  }),
  created() {
    this.getMenus()
  },
  methods: {
    // 退出登录
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('./login')
    },

    // 获取左侧菜单数据
    async getMenus() {
      const {
        data: { data, meta }
      } = await this.$http.get('menus')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      console.log(data)
      this.menus = data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
  .iconfont {
    margin-right: 10px;
  }
}
.el-main {
  background-color: #bdc3c7;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

