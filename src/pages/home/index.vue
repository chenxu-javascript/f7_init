<template>
  <f7-page class="home-page" @page:beforein="pageTitle">
    <div class="home-banner">
    </div>

    <div class="home-content">
      <div class="home-category" v-for="(item, index) in dataArray" :key="index">
        <div class="home-category-title">
          {{item.name}}
        </div>
        <div class="home-info clearfix">
          <f7-link v-for="(items, indexs) in item.children" :key="'items_'+index+indexs" :href="items.url" class="home-infoitem">
            <p class="home-itemtitle">{{items.name}}</p>
          </f7-link>
        </div>
      </div>
    </div>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      title: "智慧党建首页",
      dataArray: [
        {
          id: 1,
          name: "组织强基",
          children: [
            { id: 1, name: "支部建设", url: "/partybranch/list" },
            { id: 2, name: "通知公告", url: "/noticenews" }
          ]
        },
        {
          id: 2,
          name: "文化引领",
          children: [
            { id: 3, name: "党建活动", url: "/party-activity" },
            { id: 4, name: "党员动态", url: "/dynamic" },
            { id: 5, name: "党员社区", url: "/party-community" }
          ]
        },
        {
          id: 3,
          name: "党群服务",
          children: [
            { id: 6, name: "党员报道", url: "/partymembers" },
            { id: 7, name: "入党申请", url: "/partymembers?tabActive=1" },
            { id: 8, name: "书记信箱", url: "/mailbox" }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="less">
.home-page.page {
  background: #fff;
}

.home-banner {
  margin: 15px 15px 0 15px;
  > img {
    border-radius: 5px;
    width: 100%;
    height: 3.85rem;
    display: block;
    padding: 0;
  }
}

.home-category {
  .home-category-title {
    font-size: 0.28rem;
    font-weight: bold;
    line-height: 1;
    margin: 9px 15px 9px 30px;
    padding-left: 5px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 3px;
      height: 0.28rem;
      background: #bd1e23;
      top: 0px;
      left: -3px;
    }
  }
  .home-info {
    margin-left: 30px;
    margin-top: 8px;
    .home-infoitem {
      float: left;
      display: flex;
      flex-direction: column;
      &:not(:nth-child(4n + 1)) {
        margin-left: 0.8rem;
      }
      & > img {
        display: block;
        width: 1rem;
        height: 1rem;
        border-radius: 3px;
      }
      .home-itemtitle {
        padding: 0;
        margin: 2px 0;
        font-size: 11px;
        line-height: 1.5;
        color: #474747;
      }
    }
  }
}
</style>
