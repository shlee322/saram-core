module.exports = {
    apis:{
        list:{
            name:"List",
            info:"리스트 전체를 가져옵니다."
        },
        insert:{
            name:"Insert",
            info:"데이터를 삽입합니다.",
            request:{
                Data:[{name:"value", value:"삽입할 데이터"}]
            }
        },
        get:{
            name:"Get",
            info:"해당 객체를 가져옵니다.",
            request:{
                Parameter:[{name:"uuid", value:"가져올 객채의 UUID"}]
            }
        },
        update:{
            name:"Update",
            info:"데이터를 수정합니다.",
            request:{
                Parameter:[{name:"uuid", value:"수정할 객채의 UUID"}],
                Data:[{name:"value", value:"수정할 데이터"}]
            }
        },
        delete:{
            name:"Delete",
            info:"데이터를 삭제합니다.",
            request:{
                Parameter:[{name:"uuid", value:"삭제할 객채의 UUID"}]
            }
        }
    }
}