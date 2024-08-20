<template>
  <div style="line-height:36px">
    <label v-show="!isEdit&&(newValue.length<hiddenNum||hiddenNum==0)" :style="{'display': 'inline-block', 'vertical-align':'middle', 'font-size': fontSize+'px'}">
      {{newValue}}
      <el-icon @click="onEditClick"><EditPen /></el-icon>
<!--      <i class="el-icon-edit" @click="onEditClick"></i>-->
    </label>
    <div v-show="!isEdit&&newValue.length>=hiddenNum&&hiddenNum!=0" style="display:inline-block;vertical-align:middle;">
      <el-tooltip effect="light" placement="top">
        <div slot="content">{{newValue}}</div>
<!--        <label>-->
<!--          {{newValue.substring(0,hiddenNum-1)}}-->
<!--          <i class="el-icon-edit" @click="onEditClick" style="position: absolute; line-height: 36px;margin-left:3px;">-->
<!--          </i>-->
<!--        </label>-->
      </el-tooltip>
    </div>
    <el-input ref="input"
              v-model="newValue"
              v-show="isEdit"
              @change="$emit('change',$event)"
              @blur="isEdit=false">
    </el-input>
  </div>
</template>

<script>
  export default {
    name: 'EditorLabel',
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: '',
      },
      hiddenNum: {
        type: Number,
        default: 0,
      },
      fontSize: {
        type: Number,
        default: 14,
      }
    },
    watch: {
      value: function (val) {
        console.log(11111111111111111);
        console.log(val);
        this.newValue = val.trim();
      }
    },
    created() {
      this.newValue = this.value.trim();
    },
    data() {
      return {
        isEdit: false,
        newValue: ''
      }
    },
    mounted() {
    },
    methods: {
      onEditClick() {
        this.isEdit = true;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      },

      onInput() {
        this.newValue = this.newValue.trim();
      }
    }
  }
</script>

