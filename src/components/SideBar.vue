<template>
  <sidebar-menu 
    :menu="menu" 
    :collapsed="collapsed"
    :disableHover=true
    @update:collapsed="onCollapse"
  />
</template>

<script>
  export default {
    name: 'SideBar',
    data() {
      return {
        collapsed: true,
        menu: [
          {
            header: 'Main Navigation',
            hiddenOnCollapse: true,
            hidden: true
          },
          {
            href: '/',
            title: 'Home',
            icon: 'fa fa-list-ul'
          },
          {
            href: '/notebook',
            title: 'Notebook',
            icon: 'fa-solid fa-book',
            child: [
              {
                href: '/notebook',
                title: 'Page 1'
              }
            ]
          },
          {
            href: '/about',
            title: 'About',
            icon: 'fa-solid fa-page'
          }
        ]
      }
    },
    methods: {
      onCollapse(c) {
        self.collapsed = c;
        this.$emit('CollapsedChangeEvent', c)
      }
    }
  }
</script>
