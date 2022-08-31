<template>
   <div>
    <file-upload @update="update"></file-upload>
    <file-list ref="list_component"></file-list>
</div>
</template>
<script>
//component
import FileUpload from '../components/reportFile/FileUpload';
import FileList from '../components/reportFile/FileList';

export default {
    components: {
        'file-upload': FileUpload,
        'file-list': FileList
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
        update() {
            this.$refs.list_component.reportList();
        }
    }
  }
</script>
