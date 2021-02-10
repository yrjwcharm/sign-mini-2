import {Input, Text, View} from "@tarojs/components";
import React from "react";

const ListRow = (props) => {
  const {label, placeholder,disabled,noBorder, style, className, type, onInput} = props;
  return (
    <View className='list-row-container'>
      <View className='list-row-wrap'>
        <View className='list-row-view'>
          <Text className='list-row-text' style={style}>{label}</Text>
          <Input disabled={disabled}  style='flex:1' type={type} className={className} onInput={onInput} placeholder={placeholder}
                 placeholderClass='list-row-input-placeholder'/>
        </View>
      </View>
      {!noBorder&&<View className='line'/>}
    </View>
  )
}
export default ListRow;
