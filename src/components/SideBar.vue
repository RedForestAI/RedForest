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
            icon: 'fa fa-user'
          },
          {
            href: '/notebook',
            title: 'Notebook',
            icon: 'fa fa-notebook-area',
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
            icon: 'fa fa-about-area'
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
