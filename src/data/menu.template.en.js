var MenuTemplate = {
    items: [
        {
            text:"Data",
            icon:"glyphicon-tasks",
            items: [
                {
                    text:"Users",
                    link:"user"
                },
                {
                    text:"Roles",
                    link:"role"
                },
                {
                    text:"Participants",
                    link:"health_ministry"
                },
                {
                    text:"Categories",
                    link:"assay_category"
                },
                {
                    text:"Code Groups",
                    link:"code_group"
                },
                {
                    text:"Codes",
                    link:"assay_code"
                }
            ],
            root: true
        },
        {
            text:"PT",
            icon:"glyphicon-list-alt",
            items: [
                {
                    text:"Templates",
                    link:"template"
                },
                {
                    text:"History",
                    link:"assessment"
                },
                {
                    text:"Launch PT",
                    link:"assessment.new"
                }
            ],
            root: true
        },{
          text:"My PT",
          icon:"glyphicon-list-alt",
          items:[
              {
                text:"Activated",
                link:"activated_form"
              },
              {
                text:"History",
                link:"closed_form"
              }
          ]
        }, {
           text:"IQC Tracking",
           icon:"glyphicon-list-alt",
           items:[
               {
                text:"IQC Plan",
                link:"iqc_template"
               },
               {
                text:"IQC Programs",
                link:"plan"
               }
           ],
           root:true
        },
        {
            text:"Statistic",
            icon:"glyphicon-stats",
            items: [

            ],
            root: true
        }
    ]
}
module.exports = MenuTemplate;
