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
                    link:"cdc"
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
