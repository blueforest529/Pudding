<template>
<div>
    <resource></resource>
    <basic-info :defaultInfo="defaultInfo"></basic-info>
</div>
</template>
<script>
//component
import Resource from '../components/dashboard/Resource';
import BasicInfo from '../components/dashboard/BasicInfo';

export default {
    components: {
        'resource': Resource,
        'basic-info': BasicInfo
    },
    created() {
        this.defaultInfo =this.$store.state.auth.defaultInfo;
    },
    mounted() {
        
    },
    data: () => ({
        defaultInfo:{} 
    }),
    methods: {
        
    }
  }
</script>

