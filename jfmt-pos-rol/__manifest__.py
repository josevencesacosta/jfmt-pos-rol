# -*- coding: utf-8 -*-
{
    'name': "Ajustes POS",
    'summary': """
    """,
    'description': """
    """,
    'category': 'Point Of Sale',
    'version': '18.0',
    'depends': ['base','point_of_sale'],
    'data': [
        'views/inherit_res_users_views.xml',
        'data/data.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'jfmt-pos-rol/static/src/css/pos.scss',
            'jfmt-pos-rol/static/src/**/*',
        ],
    }
}

