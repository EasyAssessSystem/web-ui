var MenuTemplate = {
    items: [
        {
            text:"数据管理",
            icon:"glyphicon-tasks",
            items: [
                {
                    text:"用户管理",
                    link:"user"
                },
                {
                    text:"角色管理",
                    link:"role"
                },
                {
                    text:"机构管理",
                    link:"health_ministry"
                },
                {
                    text:"检测类别管理",
                    link:"assay_category"
                },
                {
                    text:"代码组管理",
                    link:"code_group"
                },
                {
                    text:"代码管理",
                    link:"assay_code"
                }
            ],
            root: true
        },
        {
            text:"考评管理",
            icon:"glyphicon-list-alt",
            items: [
                {
                    text:"制作模板",
                    link:"template"
                }
            ],
            root: true
        },
        {
            text:"数据统计",
            icon:"glyphicon-stats",
            items: [

            ],
            root: true
        }
    ]
}
module.exports = MenuTemplate;
