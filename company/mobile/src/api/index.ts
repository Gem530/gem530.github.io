import request from '@/request'

// 图片上传
export function uploadImg(data: FormData) {
  return request({
    url: "/upload/img",
    method: "post",
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  });
}