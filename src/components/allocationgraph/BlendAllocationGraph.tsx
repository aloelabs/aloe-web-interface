import React, { useState } from 'react';
import BlendGraph from '../graph/BlendGraph';
import {
  add,
  differenceInDays,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns/esm';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Text } from '../common/Typography';
import { calculateReturns } from '../../util/ReturnsCalculations';

const WHITE = '#FFFFFF';
const GRAPH_BUTTON_ACTIVE_BG_COLOR = '#0d171e';
const GRAPH_BUTTON_TEXT_COLOR = '#3f5464'; //rgba(43, 64, 80, 1);

const POOL_RETURNS_EXAMPLE = [
  {
      "timestamp": "2022-05-03T02:42:07+00:00",
      "block_number": 14702093,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742183,
      "inventory1": 0.10136804608132477,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T02:46:49+00:00",
      "block_number": 14702106,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742183,
      "inventory1": 0.10136804608132477,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T02:52:14+00:00",
      "block_number": 14702121,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742204,
      "inventory1": 0.10136513933651971,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T02:56:50+00:00",
      "block_number": 14702139,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742204,
      "inventory1": 0.10136513933651971,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:01:45+00:00",
      "block_number": 14702161,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742204,
      "inventory1": 0.10136513933651971,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:07:02+00:00",
      "block_number": 14702182,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742205,
      "inventory1": 0.10136502408586603,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:12:11+00:00",
      "block_number": 14702202,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742205,
      "inventory1": 0.10136503474378866,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:17:13+00:00",
      "block_number": 14702223,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742205,
      "inventory1": 0.10136503474378866,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:22:11+00:00",
      "block_number": 14702251,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742201,
      "inventory1": 0.10136551551267332,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:27:08+00:00",
      "block_number": 14702268,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742201,
      "inventory1": 0.10136551551267332,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:31:54+00:00",
      "block_number": 14702284,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742345,
      "inventory1": 0.10134609316028448,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:37:12+00:00",
      "block_number": 14702306,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742345,
      "inventory1": 0.10134609316028448,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:41:11+00:00",
      "block_number": 14702323,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742345,
      "inventory1": 0.10134609316028448,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:47:13+00:00",
      "block_number": 14702351,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742345,
      "inventory1": 0.10134609316028448,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:51:59+00:00",
      "block_number": 14702368,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742654,
      "inventory1": 0.10130420739001349,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T03:56:54+00:00",
      "block_number": 14702387,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742656,
      "inventory1": 0.1013039846820944,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:02:09+00:00",
      "block_number": 14702411,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742656,
      "inventory1": 0.1013039846820944,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:07:08+00:00",
      "block_number": 14702434,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742656,
      "inventory1": 0.1013039846820944,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:12:11+00:00",
      "block_number": 14702453,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742656,
      "inventory1": 0.1013039846820944,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:17:10+00:00",
      "block_number": 14702474,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742865,
      "inventory1": 0.10127563571294597,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:22:09+00:00",
      "block_number": 14702492,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742893,
      "inventory1": 0.10127194263566254,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:27:03+00:00",
      "block_number": 14702519,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742955,
      "inventory1": 0.10126344915338202,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:31:25+00:00",
      "block_number": 14702544,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742955,
      "inventory1": 0.10126344915338202,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:37:00+00:00",
      "block_number": 14702565,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742955,
      "inventory1": 0.10126344915338202,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:41:53+00:00",
      "block_number": 14702587,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742955,
      "inventory1": 0.10126344915338202,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:46:57+00:00",
      "block_number": 14702615,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074301,
      "inventory1": 0.10125610827348437,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:51:35+00:00",
      "block_number": 14702630,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074301,
      "inventory1": 0.10125610827348437,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T04:57:10+00:00",
      "block_number": 14702648,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074301,
      "inventory1": 0.10125610827348437,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:02:09+00:00",
      "block_number": 14702673,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742894,
      "inventory1": 0.101271714369865,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:06:40+00:00",
      "block_number": 14702685,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742367,
      "inventory1": 0.10134310427141578,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:12:12+00:00",
      "block_number": 14702703,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741995,
      "inventory1": 0.10139351592793547,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:17:13+00:00",
      "block_number": 14702726,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741293,
      "inventory1": 0.1014887687250339,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:22:05+00:00",
      "block_number": 14702758,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741399,
      "inventory1": 0.10147434240495154,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:26:44+00:00",
      "block_number": 14702782,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741404,
      "inventory1": 0.10147371058393938,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:32:13+00:00",
      "block_number": 14702808,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741643,
      "inventory1": 0.10144116095703491,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:36:56+00:00",
      "block_number": 14702829,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741643,
      "inventory1": 0.10144116095703491,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:41:23+00:00",
      "block_number": 14702845,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741643,
      "inventory1": 0.10144116095703491,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:47:08+00:00",
      "block_number": 14702874,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741643,
      "inventory1": 0.10144116095703491,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:51:56+00:00",
      "block_number": 14702890,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741623,
      "inventory1": 0.10144391499995112,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T05:57:12+00:00",
      "block_number": 14702908,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741838,
      "inventory1": 0.10141482311660004,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:02:14+00:00",
      "block_number": 14702936,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741838,
      "inventory1": 0.10141482311660004,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:06:59+00:00",
      "block_number": 14702965,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741838,
      "inventory1": 0.10141482311660004,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:11:46+00:00",
      "block_number": 14702980,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741851,
      "inventory1": 0.10141295699550729,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:17:11+00:00",
      "block_number": 14703002,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741862,
      "inventory1": 0.10141145508199981,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:21:54+00:00",
      "block_number": 14703027,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:26:52+00:00",
      "block_number": 14703044,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:32:12+00:00",
      "block_number": 14703070,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:36:56+00:00",
      "block_number": 14703090,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:42:06+00:00",
      "block_number": 14703104,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:47:02+00:00",
      "block_number": 14703128,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:52:14+00:00",
      "block_number": 14703150,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T06:57:02+00:00",
      "block_number": 14703177,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:02:06+00:00",
      "block_number": 14703208,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:07:06+00:00",
      "block_number": 14703225,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742077,
      "inventory1": 0.10138240498551965,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:12:00+00:00",
      "block_number": 14703244,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074184,
      "inventory1": 0.10141452134065564,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:17:09+00:00",
      "block_number": 14703266,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074184,
      "inventory1": 0.10141452134065564,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:21:51+00:00",
      "block_number": 14703290,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741476,
      "inventory1": 0.10146383215085684,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:26:43+00:00",
      "block_number": 14703309,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741712,
      "inventory1": 0.10143191696182684,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:31:45+00:00",
      "block_number": 14703330,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741935,
      "inventory1": 0.10140155072182411,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:37:04+00:00",
      "block_number": 14703354,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741935,
      "inventory1": 0.10140155072182411,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:42:13+00:00",
      "block_number": 14703378,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741152,
      "inventory1": 0.10150794495405288,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:46:56+00:00",
      "block_number": 14703410,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740904,
      "inventory1": 0.1015415402637584,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:51:07+00:00",
      "block_number": 14703428,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740797,
      "inventory1": 0.10155612910709912,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T07:55:53+00:00",
      "block_number": 14703446,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740989,
      "inventory1": 0.10153003996722576,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:01:55+00:00",
      "block_number": 14703467,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741172,
      "inventory1": 0.10150517428492203,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:07:13+00:00",
      "block_number": 14703495,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741233,
      "inventory1": 0.10149691759994861,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:11:53+00:00",
      "block_number": 14703516,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074124,
      "inventory1": 0.10149589673584022,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:17:11+00:00",
      "block_number": 14703543,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741276,
      "inventory1": 0.10149100497420417,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:22:14+00:00",
      "block_number": 14703561,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741277,
      "inventory1": 0.10149087901045323,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:27:09+00:00",
      "block_number": 14703585,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741277,
      "inventory1": 0.10149084055154863,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:32:14+00:00",
      "block_number": 14703610,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741516,
      "inventory1": 0.10145840883267308,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:37:11+00:00",
      "block_number": 14703636,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741604,
      "inventory1": 0.10144648890717059,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:42:01+00:00",
      "block_number": 14703655,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741604,
      "inventory1": 0.10144648890717059,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:47:00+00:00",
      "block_number": 14703685,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741663,
      "inventory1": 0.10143848043559257,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:52:09+00:00",
      "block_number": 14703706,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741663,
      "inventory1": 0.10143848043559257,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T08:57:14+00:00",
      "block_number": 14703732,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741663,
      "inventory1": 0.10143848043559257,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:02:14+00:00",
      "block_number": 14703752,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741663,
      "inventory1": 0.10143848043559257,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:07:06+00:00",
      "block_number": 14703769,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741639,
      "inventory1": 0.10144172879034626,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:11:46+00:00",
      "block_number": 14703785,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741639,
      "inventory1": 0.10144172879034626,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:17:03+00:00",
      "block_number": 14703808,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741639,
      "inventory1": 0.10144172879034626,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:22:06+00:00",
      "block_number": 14703830,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741639,
      "inventory1": 0.10144172879034626,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:27:04+00:00",
      "block_number": 14703846,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741639,
      "inventory1": 0.10144172879034626,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:32:04+00:00",
      "block_number": 14703868,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741639,
      "inventory1": 0.10144172879034626,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:37:05+00:00",
      "block_number": 14703893,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741639,
      "inventory1": 0.10144172879034626,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:42:14+00:00",
      "block_number": 14703919,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741652,
      "inventory1": 0.1014399615450114,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:46:52+00:00",
      "block_number": 14703933,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741652,
      "inventory1": 0.1014399615450114,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:52:13+00:00",
      "block_number": 14703958,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741652,
      "inventory1": 0.1014399615450114,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T09:56:31+00:00",
      "block_number": 14703974,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741652,
      "inventory1": 0.1014399615450114,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:02:07+00:00",
      "block_number": 14703994,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741333,
      "inventory1": 0.10148333458722301,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:07:13+00:00",
      "block_number": 14704020,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741065,
      "inventory1": 0.10151977144753731,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:12:01+00:00",
      "block_number": 14704035,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741065,
      "inventory1": 0.10151977144753731,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:16:38+00:00",
      "block_number": 14704058,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741065,
      "inventory1": 0.10151977144753731,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:22:11+00:00",
      "block_number": 14704078,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741124,
      "inventory1": 0.1015117568086675,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:27:00+00:00",
      "block_number": 14704100,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074088,
      "inventory1": 0.1015447945566963,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:31:55+00:00",
      "block_number": 14704121,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074088,
      "inventory1": 0.1015447945566963,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:37:14+00:00",
      "block_number": 14704147,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741015,
      "inventory1": 0.10152644421270701,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:42:08+00:00",
      "block_number": 14704174,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741029,
      "inventory1": 0.10152459025943919,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:47:03+00:00",
      "block_number": 14704189,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741029,
      "inventory1": 0.10152459025943919,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:51:48+00:00",
      "block_number": 14704209,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074103,
      "inventory1": 0.1015244448356599,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T10:56:59+00:00",
      "block_number": 14704228,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741235,
      "inventory1": 0.10149655899661375,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:02:13+00:00",
      "block_number": 14704252,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741235,
      "inventory1": 0.10149655899661375,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:07:11+00:00",
      "block_number": 14704283,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741235,
      "inventory1": 0.10149655899661375,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:12:14+00:00",
      "block_number": 14704313,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741235,
      "inventory1": 0.10149655899661375,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:16:41+00:00",
      "block_number": 14704342,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741233,
      "inventory1": 0.10149689581314293,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:22:11+00:00",
      "block_number": 14704357,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741233,
      "inventory1": 0.10149689581314293,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:27:07+00:00",
      "block_number": 14704381,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741503,
      "inventory1": 0.10146018920534028,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:32:12+00:00",
      "block_number": 14704402,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741503,
      "inventory1": 0.10146018920534028,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:36:40+00:00",
      "block_number": 14704424,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741503,
      "inventory1": 0.10146018920534028,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:42:14+00:00",
      "block_number": 14704446,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741503,
      "inventory1": 0.10146018920534028,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:47:06+00:00",
      "block_number": 14704467,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741507,
      "inventory1": 0.10145971127135908,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:52:12+00:00",
      "block_number": 14704491,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741507,
      "inventory1": 0.10145971127135908,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T11:57:12+00:00",
      "block_number": 14704512,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741878,
      "inventory1": 0.10140934104189529,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:01:27+00:00",
      "block_number": 14704531,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741878,
      "inventory1": 0.10140934104189529,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:07:13+00:00",
      "block_number": 14704550,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741878,
      "inventory1": 0.10140933419852013,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:11:43+00:00",
      "block_number": 14704574,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741878,
      "inventory1": 0.10140933419852013,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:17:05+00:00",
      "block_number": 14704605,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741878,
      "inventory1": 0.10140933419852013,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:22:08+00:00",
      "block_number": 14704624,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741866,
      "inventory1": 0.10141095477885574,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:27:14+00:00",
      "block_number": 14704642,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741866,
      "inventory1": 0.10141095477885574,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:32:00+00:00",
      "block_number": 14704671,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741881,
      "inventory1": 0.10140890219583229,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:37:04+00:00",
      "block_number": 14704689,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741978,
      "inventory1": 0.10139572156671807,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:42:07+00:00",
      "block_number": 14704706,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741978,
      "inventory1": 0.10139572156671807,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:47:03+00:00",
      "block_number": 14704731,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741978,
      "inventory1": 0.10139572156671807,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:51:59+00:00",
      "block_number": 14704748,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742,
      "inventory1": 0.10139281262059353,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T12:57:12+00:00",
      "block_number": 14704771,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742,
      "inventory1": 0.10139281262059353,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:02:13+00:00",
      "block_number": 14704792,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742,
      "inventory1": 0.10139281262059353,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:07:00+00:00",
      "block_number": 14704817,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742,
      "inventory1": 0.10139281262059353,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:11:49+00:00",
      "block_number": 14704830,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742,
      "inventory1": 0.10139281262059353,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:17:09+00:00",
      "block_number": 14704852,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742,
      "inventory1": 0.10139281262059353,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:22:06+00:00",
      "block_number": 14704871,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742,
      "inventory1": 0.10139281262059353,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:26:47+00:00",
      "block_number": 14704892,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742002,
      "inventory1": 0.1013925559254776,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:32:13+00:00",
      "block_number": 14704921,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742002,
      "inventory1": 0.1013925559254776,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:37:12+00:00",
      "block_number": 14704942,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742002,
      "inventory1": 0.1013925559254776,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:42:09+00:00",
      "block_number": 14704957,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742002,
      "inventory1": 0.1013925559254776,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:47:04+00:00",
      "block_number": 14704980,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742002,
      "inventory1": 0.1013925559254776,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:51:39+00:00",
      "block_number": 14705003,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741897,
      "inventory1": 0.1014068123173759,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T13:56:39+00:00",
      "block_number": 14705022,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741947,
      "inventory1": 0.10139993462230655,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:01:53+00:00",
      "block_number": 14705043,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742104,
      "inventory1": 0.10137869811954597,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:06:45+00:00",
      "block_number": 14705068,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074239,
      "inventory1": 0.10133990748632404,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:12:14+00:00",
      "block_number": 14705085,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074239,
      "inventory1": 0.10134001571010526,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:16:51+00:00",
      "block_number": 14705112,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074267,
      "inventory1": 0.10130201003674291,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:22:04+00:00",
      "block_number": 14705132,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074267,
      "inventory1": 0.10130201003674291,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:27:01+00:00",
      "block_number": 14705151,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074267,
      "inventory1": 0.10130201003674291,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:32:11+00:00",
      "block_number": 14705166,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742445,
      "inventory1": 0.10133244604373302,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:37:02+00:00",
      "block_number": 14705186,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742445,
      "inventory1": 0.10133244604373302,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:42:09+00:00",
      "block_number": 14705208,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742445,
      "inventory1": 0.10133244604373302,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:46:59+00:00",
      "block_number": 14705237,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741993,
      "inventory1": 0.10139375021798486,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:51:18+00:00",
      "block_number": 14705258,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741993,
      "inventory1": 0.10139375021798486,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T14:56:52+00:00",
      "block_number": 14705282,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742102,
      "inventory1": 0.10137891634013407,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:02:06+00:00",
      "block_number": 14705312,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741754,
      "inventory1": 0.10142615169748123,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:07:14+00:00",
      "block_number": 14705335,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741839,
      "inventory1": 0.10141464556617669,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:12:01+00:00",
      "block_number": 14705350,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074189,
      "inventory1": 0.10140771396293907,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:17:01+00:00",
      "block_number": 14705378,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741907,
      "inventory1": 0.10140537458041142,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:22:12+00:00",
      "block_number": 14705405,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741907,
      "inventory1": 0.10140537458041142,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:27:04+00:00",
      "block_number": 14705431,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741907,
      "inventory1": 0.10140537458041142,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:32:13+00:00",
      "block_number": 14705454,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741724,
      "inventory1": 0.10143028704610742,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:36:35+00:00",
      "block_number": 14705479,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741749,
      "inventory1": 0.10142679025353754,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:41:58+00:00",
      "block_number": 14705511,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741566,
      "inventory1": 0.10145174497065432,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:46:57+00:00",
      "block_number": 14705531,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741566,
      "inventory1": 0.10145176918475057,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:52:06+00:00",
      "block_number": 14705551,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741382,
      "inventory1": 0.10147676128979548,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T15:56:55+00:00",
      "block_number": 14705571,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741382,
      "inventory1": 0.10147678469405573,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:01:58+00:00",
      "block_number": 14705588,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741196,
      "inventory1": 0.10150202295759901,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:07:14+00:00",
      "block_number": 14705608,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740772,
      "inventory1": 0.10155966580495977,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:12:14+00:00",
      "block_number": 14705635,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740418,
      "inventory1": 0.10160791867652105,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:16:52+00:00",
      "block_number": 14705659,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740418,
      "inventory1": 0.10160794118973371,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:22:00+00:00",
      "block_number": 14705682,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740379,
      "inventory1": 0.10161322980470747,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:27:12+00:00",
      "block_number": 14705702,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740379,
      "inventory1": 0.10161325507106353,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:32:04+00:00",
      "block_number": 14705728,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074045,
      "inventory1": 0.1016035743546896,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:37:12+00:00",
      "block_number": 14705751,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074045,
      "inventory1": 0.10160359929711801,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:42:06+00:00",
      "block_number": 14705774,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074045,
      "inventory1": 0.1016036231057997,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:47:00+00:00",
      "block_number": 14705790,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074045,
      "inventory1": 0.10160364691448139,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:51:41+00:00",
      "block_number": 14705824,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740571,
      "inventory1": 0.10158729962143322,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T16:57:14+00:00",
      "block_number": 14705843,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740571,
      "inventory1": 0.10158732658840941,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:02:10+00:00",
      "block_number": 14705859,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740875,
      "inventory1": 0.10154595108668382,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:07:13+00:00",
      "block_number": 14705881,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740875,
      "inventory1": 0.1015459756242027,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:11:40+00:00",
      "block_number": 14705905,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740867,
      "inventory1": 0.10154709588877557,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:17:13+00:00",
      "block_number": 14705929,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741343,
      "inventory1": 0.10148242260351735,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:21:55+00:00",
      "block_number": 14705952,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741484,
      "inventory1": 0.1014633618688581,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:27:11+00:00",
      "block_number": 14705970,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741484,
      "inventory1": 0.10146338745914181,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:31:58+00:00",
      "block_number": 14705985,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741479,
      "inventory1": 0.10146404941461241,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:37:13+00:00",
      "block_number": 14706008,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741514,
      "inventory1": 0.10145934056299294,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:41:53+00:00",
      "block_number": 14706030,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741749,
      "inventory1": 0.10142742841562177,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:47:12+00:00",
      "block_number": 14706049,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741749,
      "inventory1": 0.10142745424885122,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:51:48+00:00",
      "block_number": 14706072,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741804,
      "inventory1": 0.10142005906959906,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T17:57:04+00:00",
      "block_number": 14706093,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741647,
      "inventory1": 0.10144140649870141,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:02:10+00:00",
      "block_number": 14706117,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741149,
      "inventory1": 0.10150903948345683,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:07:06+00:00",
      "block_number": 14706144,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741598,
      "inventory1": 0.10144805320350331,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:12:09+00:00",
      "block_number": 14706164,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741826,
      "inventory1": 0.10141708310370796,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:16:58+00:00",
      "block_number": 14706192,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741785,
      "inventory1": 0.10142268170363974,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:21:20+00:00",
      "block_number": 14706211,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741682,
      "inventory1": 0.10143678059987311,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:27:12+00:00",
      "block_number": 14706236,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742133,
      "inventory1": 0.10137559964947021,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:32:06+00:00",
      "block_number": 14706252,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074246,
      "inventory1": 0.10133130111262936,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:36:58+00:00",
      "block_number": 14706283,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742536,
      "inventory1": 0.10132103200384104,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:42:07+00:00",
      "block_number": 14706306,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742015,
      "inventory1": 0.10139168272052432,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:47:06+00:00",
      "block_number": 14706332,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074194,
      "inventory1": 0.10140179529889846,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:52:04+00:00",
      "block_number": 14706359,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741933,
      "inventory1": 0.10140276710054741,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T18:57:11+00:00",
      "block_number": 14706381,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741724,
      "inventory1": 0.10143116175750107,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:01:38+00:00",
      "block_number": 14706400,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741747,
      "inventory1": 0.10142805952609714,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:07:11+00:00",
      "block_number": 14706425,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741482,
      "inventory1": 0.10146403867701173,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:12:14+00:00",
      "block_number": 14706448,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741564,
      "inventory1": 0.101453009748223,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:17:12+00:00",
      "block_number": 14706474,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741602,
      "inventory1": 0.1014478671468532,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:22:14+00:00",
      "block_number": 14706494,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741665,
      "inventory1": 0.10143935912692542,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:26:51+00:00",
      "block_number": 14706517,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741546,
      "inventory1": 0.10145549881526797,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:32:11+00:00",
      "block_number": 14706544,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741451,
      "inventory1": 0.10146844164902889,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:36:50+00:00",
      "block_number": 14706564,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741629,
      "inventory1": 0.10144423757519286,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:41:40+00:00",
      "block_number": 14706585,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741092,
      "inventory1": 0.10151719036309208,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:47:14+00:00",
      "block_number": 14706618,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074107,
      "inventory1": 0.10152019663529281,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:52:04+00:00",
      "block_number": 14706636,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074078,
      "inventory1": 0.10155967098423821,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T19:57:04+00:00",
      "block_number": 14706654,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074078,
      "inventory1": 0.10155969527881134,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:02:02+00:00",
      "block_number": 14706679,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740512,
      "inventory1": 0.10159615180596225,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:07:14+00:00",
      "block_number": 14706710,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740512,
      "inventory1": 0.10159617707231834,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:11:25+00:00",
      "block_number": 14706730,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074052,
      "inventory1": 0.10159523328542856,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:17:09+00:00",
      "block_number": 14706748,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074052,
      "inventory1": 0.10159526114320576,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:22:04+00:00",
      "block_number": 14706765,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740478,
      "inventory1": 0.10160096642243827,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:26:57+00:00",
      "block_number": 14706790,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740562,
      "inventory1": 0.101589495994871,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:32:14+00:00",
      "block_number": 14706813,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740562,
      "inventory1": 0.10158952166613663,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:37:06+00:00",
      "block_number": 14706839,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740562,
      "inventory1": 0.1015895453128545,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:42:02+00:00",
      "block_number": 14706856,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740562,
      "inventory1": 0.1015895692835,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:47:05+00:00",
      "block_number": 14706880,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740565,
      "inventory1": 0.10158927435928193,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:52:13+00:00",
      "block_number": 14706896,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740565,
      "inventory1": 0.10158929930171037,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T20:57:08+00:00",
      "block_number": 14706920,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00740913,
      "inventory1": 0.10154190664471087,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:02:08+00:00",
      "block_number": 14706943,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741236,
      "inventory1": 0.10149800434889142,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:06:33+00:00",
      "block_number": 14706964,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741236,
      "inventory1": 0.1014980258091428,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:12:03+00:00",
      "block_number": 14706983,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074121,
      "inventory1": 0.10150162041521577,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:16:49+00:00",
      "block_number": 14706996,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741198,
      "inventory1": 0.10150324659731508,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:22:13+00:00",
      "block_number": 14707011,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741321,
      "inventory1": 0.10148661401427761,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:27:12+00:00",
      "block_number": 14707035,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741653,
      "inventory1": 0.10144157878623072,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:31:56+00:00",
      "block_number": 14707055,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741169,
      "inventory1": 0.10150724024076845,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:37:02+00:00",
      "block_number": 14707073,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741222,
      "inventory1": 0.10150007345009641,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:41:54+00:00",
      "block_number": 14707088,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741281,
      "inventory1": 0.10149205773094705,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:47:14+00:00",
      "block_number": 14707114,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741366,
      "inventory1": 0.10148052468280985,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:52:13+00:00",
      "block_number": 14707141,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741366,
      "inventory1": 0.1014805258424496,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T21:57:04+00:00",
      "block_number": 14707166,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741546,
      "inventory1": 0.101456001658239,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:02:00+00:00",
      "block_number": 14707187,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741555,
      "inventory1": 0.10145486639035274,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:07:08+00:00",
      "block_number": 14707209,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741612,
      "inventory1": 0.1014471477513206,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:12:08+00:00",
      "block_number": 14707234,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741469,
      "inventory1": 0.10146648197633604,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:17:12+00:00",
      "block_number": 14707258,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742319,
      "inventory1": 0.10135120785920988,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:21:45+00:00",
      "block_number": 14707274,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742319,
      "inventory1": 0.10135120891800697,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:27:12+00:00",
      "block_number": 14707289,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742404,
      "inventory1": 0.10133971513602193,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:32:08+00:00",
      "block_number": 14707312,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742404,
      "inventory1": 0.10133971628402169,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:37:11+00:00",
      "block_number": 14707339,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742404,
      "inventory1": 0.10133971745917013,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:42:12+00:00",
      "block_number": 14707357,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742404,
      "inventory1": 0.1013397186265618,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:46:50+00:00",
      "block_number": 14707375,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742404,
      "inventory1": 0.10133971970475077,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:51:48+00:00",
      "block_number": 14707392,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074215,
      "inventory1": 0.1013741005275799,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T22:57:12+00:00",
      "block_number": 14707420,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074215,
      "inventory1": 0.10137410178417426,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:02:08+00:00",
      "block_number": 14707444,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074197,
      "inventory1": 0.10139853577910646,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:07:13+00:00",
      "block_number": 14707466,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074197,
      "inventory1": 0.10139853696201163,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:11:43+00:00",
      "block_number": 14707493,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742013,
      "inventory1": 0.1013927245124781,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:17:09+00:00",
      "block_number": 14707517,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742091,
      "inventory1": 0.1013822111774699,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:21:54+00:00",
      "block_number": 14707535,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00742091,
      "inventory1": 0.10138221228280754,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:26:55+00:00",
      "block_number": 14707554,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074191,
      "inventory1": 0.10140674314939982,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:31:29+00:00",
      "block_number": 14707572,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074191,
      "inventory1": 0.1014067442120753,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:37:13+00:00",
      "block_number": 14707595,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741911,
      "inventory1": 0.1014066220298743,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:42:11+00:00",
      "block_number": 14707621,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741931,
      "inventory1": 0.101403883525524,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:47:13+00:00",
      "block_number": 14707644,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074195,
      "inventory1": 0.1014013509839351,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:51:59+00:00",
      "block_number": 14707673,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741768,
      "inventory1": 0.10142592845226493,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-03T23:57:10+00:00",
      "block_number": 14707693,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741768,
      "inventory1": 0.10142592965841772,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:02:11+00:00",
      "block_number": 14707711,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741768,
      "inventory1": 0.10142593082578749,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:06:58+00:00",
      "block_number": 14707739,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741399,
      "inventory1": 0.10147600234692736,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:12:10+00:00",
      "block_number": 14707757,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741379,
      "inventory1": 0.10147873631816054,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:16:53+00:00",
      "block_number": 14707777,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741379,
      "inventory1": 0.10147873175100877,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:22:00+00:00",
      "block_number": 14707800,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741379,
      "inventory1": 0.10147873294164836,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:26:50+00:00",
      "block_number": 14707823,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741379,
      "inventory1": 0.10147873406637747,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:31:57+00:00",
      "block_number": 14707842,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741379,
      "inventory1": 0.10147873525704221,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:36:55+00:00",
      "block_number": 14707864,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741518,
      "inventory1": 0.10145986301283733,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:41:53+00:00",
      "block_number": 14707879,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741535,
      "inventory1": 0.10145765721206733,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:46:20+00:00",
      "block_number": 14707893,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741535,
      "inventory1": 0.10145765824759659,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:52:12+00:00",
      "block_number": 14707911,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741535,
      "inventory1": 0.10145765961278871,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T00:57:13+00:00",
      "block_number": 14707931,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741661,
      "inventory1": 0.10144055743641348,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:02:06+00:00",
      "block_number": 14707958,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741552,
      "inventory1": 0.10145525036329689,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:07:09+00:00",
      "block_number": 14707975,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.0074126,
      "inventory1": 0.1014949485832622,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:11:52+00:00",
      "block_number": 14707995,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741252,
      "inventory1": 0.10149597417982437,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:17:08+00:00",
      "block_number": 14708022,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741252,
      "inventory1": 0.1014959754053946,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:22:07+00:00",
      "block_number": 14708040,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741252,
      "inventory1": 0.10149597656503222,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:27:02+00:00",
      "block_number": 14708059,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741066,
      "inventory1": 0.10152130647918696,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:32:00+00:00",
      "block_number": 14708082,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741066,
      "inventory1": 0.10152130763494621,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:36:53+00:00",
      "block_number": 14708100,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741066,
      "inventory1": 0.10152130877131352,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:41:03+00:00",
      "block_number": 14708118,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741066,
      "inventory1": 0.10152130974091021,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:47:12+00:00",
      "block_number": 14708139,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741066,
      "inventory1": 0.10152131117203493,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:52:07+00:00",
      "block_number": 14708159,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741066,
      "inventory1": 0.101521312316159,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T01:57:11+00:00",
      "block_number": 14708180,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741089,
      "inventory1": 0.10151820403422142,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:02:13+00:00",
      "block_number": 14708201,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741075,
      "inventory1": 0.10152006656781365,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:06:40+00:00",
      "block_number": 14708223,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741075,
      "inventory1": 0.10152006760334291,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:11:41+00:00",
      "block_number": 14708244,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741075,
      "inventory1": 0.10152006877073733,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:17:03+00:00",
      "block_number": 14708266,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741075,
      "inventory1": 0.10152007001957786,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:22:13+00:00",
      "block_number": 14708284,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741133,
      "inventory1": 0.1015121796222167,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:27:11+00:00",
      "block_number": 14708304,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741779,
      "inventory1": 0.10142456549467928,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:31:57+00:00",
      "block_number": 14708325,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741779,
      "inventory1": 0.10142456660389788,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:36:37+00:00",
      "block_number": 14708350,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741136,
      "inventory1": 0.10151180435779372,
      "total_supply": 0.10269314707038607
  },
  {
      "timestamp": "2022-05-04T02:42:03+00:00",
      "block_number": 14708379,
      "pool_address": "0xE801c4175A0341e65dFef8F3B79e1889047AfEbb",
      "chain_id": 1,
      "inventory0": 0.00741215,
      "inventory1": 0.10150111539197583,
      "total_supply": 0.10269314707038607
  }
];
const TOKEN0_RETURNS_EXAMPLE = [
  {
      "timestamp": 1651545734,
      "price": 38360.53
  },
  {
      "timestamp": 1651546034,
      "price": 38374.715
  },
  {
      "timestamp": 1651546334,
      "price": 38461.585
  },
  {
      "timestamp": 1651546634,
      "price": 38393.884999999995
  },
  {
      "timestamp": 1651546934,
      "price": 38403.125
  },
  {
      "timestamp": 1651547234,
      "price": 38443.134999999995
  },
  {
      "timestamp": 1651547534,
      "price": 38545.42
  },
  {
      "timestamp": 1651547834,
      "price": 38545.645000000004
  },
  {
      "timestamp": 1651548134,
      "price": 38525.34
  },
  {
      "timestamp": 1651548434,
      "price": 38555.16
  },
  {
      "timestamp": 1651548734,
      "price": 38555.119999999995
  },
  {
      "timestamp": 1651549034,
      "price": 38524.08
  },
  {
      "timestamp": 1651549334,
      "price": 38524.085
  },
  {
      "timestamp": 1651549634,
      "price": 38512.77
  },
  {
      "timestamp": 1651549934,
      "price": 38513.315
  },
  {
      "timestamp": 1651550234,
      "price": 38495.244999999995
  },
  {
      "timestamp": 1651550534,
      "price": 38531.75
  },
  {
      "timestamp": 1651550834,
      "price": 38491.44
  },
  {
      "timestamp": 1651551134,
      "price": 38489.16
  },
  {
      "timestamp": 1651551434,
      "price": 38482.125
  },
  {
      "timestamp": 1651551734,
      "price": 38468.065
  },
  {
      "timestamp": 1651552034,
      "price": 38465.66
  },
  {
      "timestamp": 1651552334,
      "price": 38491.81
  },
  {
      "timestamp": 1651552634,
      "price": 38486.92
  },
  {
      "timestamp": 1651552934,
      "price": 38496.880000000005
  },
  {
      "timestamp": 1651553234,
      "price": 38479.07
  },
  {
      "timestamp": 1651553534,
      "price": 38525.765
  },
  {
      "timestamp": 1651553834,
      "price": 38529.82
  },
  {
      "timestamp": 1651554134,
      "price": 38496.979999999996
  },
  {
      "timestamp": 1651554434,
      "price": 38405.37
  },
  {
      "timestamp": 1651554734,
      "price": 38442.985
  },
  {
      "timestamp": 1651555034,
      "price": 38464.11
  },
  {
      "timestamp": 1651555334,
      "price": 38447.78
  },
  {
      "timestamp": 1651555634,
      "price": 38469.395000000004
  },
  {
      "timestamp": 1651555934,
      "price": 38496.71
  },
  {
      "timestamp": 1651556234,
      "price": 38513.44
  },
  {
      "timestamp": 1651556534,
      "price": 38507.265
  },
  {
      "timestamp": 1651556834,
      "price": 38480.51
  },
  {
      "timestamp": 1651557134,
      "price": 38524.53
  },
  {
      "timestamp": 1651557434,
      "price": 38536.94
  },
  {
      "timestamp": 1651557734,
      "price": 38524.185
  },
  {
      "timestamp": 1651558034,
      "price": 38508.205
  },
  {
      "timestamp": 1651558334,
      "price": 38517.6
  },
  {
      "timestamp": 1651558634,
      "price": 38473.92
  },
  {
      "timestamp": 1651558934,
      "price": 38475.8
  },
  {
      "timestamp": 1651559234,
      "price": 38497.735
  },
  {
      "timestamp": 1651559534,
      "price": 38537.740000000005
  },
  {
      "timestamp": 1651559834,
      "price": 38558.479999999996
  },
  {
      "timestamp": 1651560134,
      "price": 38546.6
  },
  {
      "timestamp": 1651560434,
      "price": 38521.36
  },
  {
      "timestamp": 1651560734,
      "price": 38501.2
  },
  {
      "timestamp": 1651561034,
      "price": 38484.44
  },
  {
      "timestamp": 1651561334,
      "price": 38440.83
  },
  {
      "timestamp": 1651561634,
      "price": 38440.15
  },
  {
      "timestamp": 1651561934,
      "price": 38463.695
  },
  {
      "timestamp": 1651562234,
      "price": 38502.475000000006
  },
  {
      "timestamp": 1651562534,
      "price": 38501.995
  },
  {
      "timestamp": 1651562834,
      "price": 38521.024999999994
  },
  {
      "timestamp": 1651563134,
      "price": 38491.655
  },
  {
      "timestamp": 1651563434,
      "price": 38549.125
  },
  {
      "timestamp": 1651563734,
      "price": 38519.21000000001
  },
  {
      "timestamp": 1651564034,
      "price": 38466.32
  },
  {
      "timestamp": 1651564334,
      "price": 38529.83
  },
  {
      "timestamp": 1651564634,
      "price": 38559.955
  },
  {
      "timestamp": 1651564934,
      "price": 38606.86
  },
  {
      "timestamp": 1651565234,
      "price": 38635.945
  },
  {
      "timestamp": 1651565534,
      "price": 38630.755
  },
  {
      "timestamp": 1651565834,
      "price": 38624.18
  },
  {
      "timestamp": 1651566134,
      "price": 38603.41499999999
  },
  {
      "timestamp": 1651566434,
      "price": 38622.71
  },
  {
      "timestamp": 1651566734,
      "price": 38588.85
  },
  {
      "timestamp": 1651567034,
      "price": 38632.335
  },
  {
      "timestamp": 1651567334,
      "price": 38610.26
  },
  {
      "timestamp": 1651567634,
      "price": 38556.47
  },
  {
      "timestamp": 1651567934,
      "price": 38567.66
  },
  {
      "timestamp": 1651568234,
      "price": 38547.880000000005
  },
  {
      "timestamp": 1651568534,
      "price": 38533.95
  },
  {
      "timestamp": 1651568834,
      "price": 38511.905
  },
  {
      "timestamp": 1651569134,
      "price": 38530.545
  },
  {
      "timestamp": 1651569434,
      "price": 38534.025
  },
  {
      "timestamp": 1651569734,
      "price": 38514.19
  },
  {
      "timestamp": 1651570034,
      "price": 38522.695
  },
  {
      "timestamp": 1651570334,
      "price": 38527.66
  },
  {
      "timestamp": 1651570634,
      "price": 38554.06
  },
  {
      "timestamp": 1651570934,
      "price": 38473.33
  },
  {
      "timestamp": 1651571234,
      "price": 38484.16
  },
  {
      "timestamp": 1651571534,
      "price": 38468.395000000004
  },
  {
      "timestamp": 1651571834,
      "price": 38448.405
  },
  {
      "timestamp": 1651572134,
      "price": 38458.96
  },
  {
      "timestamp": 1651572434,
      "price": 38441.91
  },
  {
      "timestamp": 1651572734,
      "price": 38460.345
  },
  {
      "timestamp": 1651573034,
      "price": 38470.5
  },
  {
      "timestamp": 1651573334,
      "price": 38449.96
  },
  {
      "timestamp": 1651573634,
      "price": 38416.46
  },
  {
      "timestamp": 1651573934,
      "price": 38432.88
  },
  {
      "timestamp": 1651574234,
      "price": 38432.05
  },
  {
      "timestamp": 1651574534,
      "price": 38412.32
  },
  {
      "timestamp": 1651574834,
      "price": 38420.215
  },
  {
      "timestamp": 1651575134,
      "price": 38411.795
  },
  {
      "timestamp": 1651575434,
      "price": 38423.84
  },
  {
      "timestamp": 1651575734,
      "price": 38406.07
  },
  {
      "timestamp": 1651576034,
      "price": 38450.869999999995
  },
  {
      "timestamp": 1651576334,
      "price": 38440.515
  },
  {
      "timestamp": 1651576634,
      "price": 38429.36
  },
  {
      "timestamp": 1651576934,
      "price": 38395.03
  },
  {
      "timestamp": 1651577234,
      "price": 38385.68
  },
  {
      "timestamp": 1651577534,
      "price": 38500.07
  },
  {
      "timestamp": 1651577834,
      "price": 38484.58500000001
  },
  {
      "timestamp": 1651578134,
      "price": 38463.365000000005
  },
  {
      "timestamp": 1651578434,
      "price": 38435.15
  },
  {
      "timestamp": 1651578734,
      "price": 38531.71
  },
  {
      "timestamp": 1651579034,
      "price": 38554.61
  },
  {
      "timestamp": 1651579334,
      "price": 38546.26
  },
  {
      "timestamp": 1651579634,
      "price": 38517.255
  },
  {
      "timestamp": 1651579934,
      "price": 38539.2
  },
  {
      "timestamp": 1651580234,
      "price": 38535.55
  },
  {
      "timestamp": 1651580534,
      "price": 38488.325
  },
  {
      "timestamp": 1651580834,
      "price": 38452.255000000005
  },
  {
      "timestamp": 1651581134,
      "price": 38459.17
  },
  {
      "timestamp": 1651581434,
      "price": 38521.185
  },
  {
      "timestamp": 1651581734,
      "price": 38504.095
  },
  {
      "timestamp": 1651582034,
      "price": 38502.925
  },
  {
      "timestamp": 1651582334,
      "price": 38484.61
  },
  {
      "timestamp": 1651582634,
      "price": 38468.26
  },
  {
      "timestamp": 1651582934,
      "price": 38448.375
  },
  {
      "timestamp": 1651583234,
      "price": 38455.215
  },
  {
      "timestamp": 1651583534,
      "price": 38454.835
  },
  {
      "timestamp": 1651583834,
      "price": 38414.41
  },
  {
      "timestamp": 1651584134,
      "price": 38381.115000000005
  },
  {
      "timestamp": 1651584434,
      "price": 38358.115
  },
  {
      "timestamp": 1651584734,
      "price": 38284.325
  },
  {
      "timestamp": 1651585034,
      "price": 38351.655
  },
  {
      "timestamp": 1651585334,
      "price": 38326.06
  },
  {
      "timestamp": 1651585634,
      "price": 38259.38
  },
  {
      "timestamp": 1651585934,
      "price": 38265.375
  },
  {
      "timestamp": 1651586234,
      "price": 38359.045
  },
  {
      "timestamp": 1651586534,
      "price": 38414.46
  },
  {
      "timestamp": 1651586834,
      "price": 38404.72
  },
  {
      "timestamp": 1651587134,
      "price": 38259.32
  },
  {
      "timestamp": 1651587434,
      "price": 38234.085
  },
  {
      "timestamp": 1651587734,
      "price": 38263.84
  },
  {
      "timestamp": 1651588034,
      "price": 38315.485
  },
  {
      "timestamp": 1651588334,
      "price": 38350.945
  },
  {
      "timestamp": 1651588634,
      "price": 38331.149999999994
  },
  {
      "timestamp": 1651588934,
      "price": 38254.740000000005
  },
  {
      "timestamp": 1651589234,
      "price": 38229.55
  },
  {
      "timestamp": 1651589534,
      "price": 38242.16
  },
  {
      "timestamp": 1651589834,
      "price": 38264.61
  },
  {
      "timestamp": 1651590134,
      "price": 38263.5
  },
  {
      "timestamp": 1651590434,
      "price": 38342.675
  },
  {
      "timestamp": 1651590734,
      "price": 38345.655
  },
  {
      "timestamp": 1651591034,
      "price": 38325.0
  },
  {
      "timestamp": 1651591334,
      "price": 38366.585
  },
  {
      "timestamp": 1651591634,
      "price": 38375.880000000005
  },
  {
      "timestamp": 1651591934,
      "price": 38363.979999999996
  },
  {
      "timestamp": 1651592234,
      "price": 38347.89
  },
  {
      "timestamp": 1651592534,
      "price": 38313.1
  },
  {
      "timestamp": 1651592834,
      "price": 38310.509999999995
  },
  {
      "timestamp": 1651593134,
      "price": 38300.244999999995
  },
  {
      "timestamp": 1651593434,
      "price": 38311.81
  },
  {
      "timestamp": 1651593734,
      "price": 38380.21
  },
  {
      "timestamp": 1651594034,
      "price": 38212.83
  },
  {
      "timestamp": 1651594334,
      "price": 38196.115
  },
  {
      "timestamp": 1651594634,
      "price": 38181.634999999995
  },
  {
      "timestamp": 1651594934,
      "price": 38205.64
  },
  {
      "timestamp": 1651595234,
      "price": 38212.380000000005
  },
  {
      "timestamp": 1651595534,
      "price": 38152.03
  },
  {
      "timestamp": 1651595834,
      "price": 38174.24
  },
  {
      "timestamp": 1651596134,
      "price": 38193.4
  },
  {
      "timestamp": 1651596434,
      "price": 38207.705
  },
  {
      "timestamp": 1651596734,
      "price": 38196.67
  },
  {
      "timestamp": 1651597034,
      "price": 38145.565
  },
  {
      "timestamp": 1651597334,
      "price": 38169.225
  },
  {
      "timestamp": 1651597634,
      "price": 38109.035
  },
  {
      "timestamp": 1651597934,
      "price": 38154.345
  },
  {
      "timestamp": 1651598234,
      "price": 38239.47
  },
  {
      "timestamp": 1651598534,
      "price": 38280.01
  },
  {
      "timestamp": 1651598834,
      "price": 38230.755000000005
  },
  {
      "timestamp": 1651599134,
      "price": 38225.8
  },
  {
      "timestamp": 1651599434,
      "price": 38197.97
  },
  {
      "timestamp": 1651599734,
      "price": 38156.025
  },
  {
      "timestamp": 1651600034,
      "price": 38182.465
  },
  {
      "timestamp": 1651600334,
      "price": 38113.695
  },
  {
      "timestamp": 1651600634,
      "price": 38086.104999999996
  },
  {
      "timestamp": 1651600934,
      "price": 37988.4
  },
  {
      "timestamp": 1651601234,
      "price": 37842.7
  },
  {
      "timestamp": 1651601534,
      "price": 37796.854999999996
  },
  {
      "timestamp": 1651601834,
      "price": 37772.56
  },
  {
      "timestamp": 1651602134,
      "price": 37740.3
  },
  {
      "timestamp": 1651602434,
      "price": 37698.6
  },
  {
      "timestamp": 1651602734,
      "price": 37746.649999999994
  },
  {
      "timestamp": 1651603034,
      "price": 37784.455
  },
  {
      "timestamp": 1651603334,
      "price": 37599.96
  },
  {
      "timestamp": 1651603634,
      "price": 37642.025
  },
  {
      "timestamp": 1651603934,
      "price": 37655.0
  },
  {
      "timestamp": 1651604234,
      "price": 37728.92
  },
  {
      "timestamp": 1651604534,
      "price": 37699.895000000004
  },
  {
      "timestamp": 1651604834,
      "price": 37691.69
  },
  {
      "timestamp": 1651605134,
      "price": 37704.1
  },
  {
      "timestamp": 1651605434,
      "price": 37720.69
  },
  {
      "timestamp": 1651605734,
      "price": 37706.565
  },
  {
      "timestamp": 1651606034,
      "price": 37654.26
  },
  {
      "timestamp": 1651606334,
      "price": 37638.31
  },
  {
      "timestamp": 1651606634,
      "price": 37608.149999999994
  },
  {
      "timestamp": 1651606934,
      "price": 37575.520000000004
  },
  {
      "timestamp": 1651607234,
      "price": 37588.235
  },
  {
      "timestamp": 1651607534,
      "price": 37697.37
  },
  {
      "timestamp": 1651607834,
      "price": 37739.71
  },
  {
      "timestamp": 1651608134,
      "price": 37691.759999999995
  },
  {
      "timestamp": 1651608434,
      "price": 37673.175
  },
  {
      "timestamp": 1651608734,
      "price": 37620.21000000001
  },
  {
      "timestamp": 1651609034,
      "price": 37602.009999999995
  },
  {
      "timestamp": 1651609334,
      "price": 37543.845
  },
  {
      "timestamp": 1651609634,
      "price": 37637.335
  },
  {
      "timestamp": 1651609934,
      "price": 37643.1
  },
  {
      "timestamp": 1651610234,
      "price": 37638.16
  },
  {
      "timestamp": 1651610534,
      "price": 37600.729999999996
  },
  {
      "timestamp": 1651610834,
      "price": 37601.46
  },
  {
      "timestamp": 1651611134,
      "price": 37617.225000000006
  },
  {
      "timestamp": 1651611434,
      "price": 37620.265
  },
  {
      "timestamp": 1651611734,
      "price": 37735.185
  },
  {
      "timestamp": 1651612034,
      "price": 37645.235
  },
  {
      "timestamp": 1651612334,
      "price": 37714.315
  },
  {
      "timestamp": 1651612634,
      "price": 37775.345
  },
  {
      "timestamp": 1651612934,
      "price": 37785.43
  },
  {
      "timestamp": 1651613234,
      "price": 37959.509999999995
  },
  {
      "timestamp": 1651613534,
      "price": 37884.56
  },
  {
      "timestamp": 1651613834,
      "price": 37794.78
  },
  {
      "timestamp": 1651614134,
      "price": 37794.395000000004
  },
  {
      "timestamp": 1651614434,
      "price": 37816.755000000005
  },
  {
      "timestamp": 1651614734,
      "price": 37798.22
  },
  {
      "timestamp": 1651615034,
      "price": 37791.075
  },
  {
      "timestamp": 1651615334,
      "price": 37797.1
  },
  {
      "timestamp": 1651615634,
      "price": 37774.58
  },
  {
      "timestamp": 1651615934,
      "price": 37760.285
  },
  {
      "timestamp": 1651616234,
      "price": 37840.635
  },
  {
      "timestamp": 1651616534,
      "price": 37849.37
  },
  {
      "timestamp": 1651616834,
      "price": 37858.520000000004
  },
  {
      "timestamp": 1651617134,
      "price": 37837.095
  },
  {
      "timestamp": 1651617434,
      "price": 37830.475
  },
  {
      "timestamp": 1651617734,
      "price": 37789.035
  },
  {
      "timestamp": 1651618034,
      "price": 37769.33500000001
  },
  {
      "timestamp": 1651618334,
      "price": 37788.485
  },
  {
      "timestamp": 1651618634,
      "price": 37754.990000000005
  },
  {
      "timestamp": 1651618934,
      "price": 37712.485
  },
  {
      "timestamp": 1651619234,
      "price": 37716.54
  },
  {
      "timestamp": 1651619534,
      "price": 37681.985
  },
  {
      "timestamp": 1651619834,
      "price": 37664.645
  },
  {
      "timestamp": 1651620134,
      "price": 37675.345
  },
  {
      "timestamp": 1651620434,
      "price": 37677.675
  },
  {
      "timestamp": 1651620734,
      "price": 37652.53
  },
  {
      "timestamp": 1651621034,
      "price": 37723.1
  },
  {
      "timestamp": 1651621334,
      "price": 37746.58500000001
  },
  {
      "timestamp": 1651621634,
      "price": 37739.71000000001
  },
  {
      "timestamp": 1651621934,
      "price": 37726.2
  },
  {
      "timestamp": 1651622234,
      "price": 37738.595
  },
  {
      "timestamp": 1651622534,
      "price": 37739.695
  },
  {
      "timestamp": 1651622834,
      "price": 37746.774999999994
  },
  {
      "timestamp": 1651623134,
      "price": 37780.805
  },
  {
      "timestamp": 1651623434,
      "price": 37792.04
  },
  {
      "timestamp": 1651623734,
      "price": 37780.875
  },
  {
      "timestamp": 1651624034,
      "price": 37754.775
  },
  {
      "timestamp": 1651624334,
      "price": 37781.37
  },
  {
      "timestamp": 1651624634,
      "price": 37820.055
  },
  {
      "timestamp": 1651624934,
      "price": 37872.1
  },
  {
      "timestamp": 1651625234,
      "price": 37858.075
  },
  {
      "timestamp": 1651625534,
      "price": 37881.104999999996
  },
  {
      "timestamp": 1651625834,
      "price": 37893.67
  },
  {
      "timestamp": 1651626134,
      "price": 37972.8
  },
  {
      "timestamp": 1651626434,
      "price": 37923.475
  },
  {
      "timestamp": 1651626734,
      "price": 37924.72
  },
  {
      "timestamp": 1651627034,
      "price": 37918.384999999995
  },
  {
      "timestamp": 1651627334,
      "price": 37922.619999999995
  },
  {
      "timestamp": 1651627634,
      "price": 37942.335
  },
  {
      "timestamp": 1651627934,
      "price": 37934.41
  },
  {
      "timestamp": 1651628234,
      "price": 37887.520000000004
  },
  {
      "timestamp": 1651628534,
      "price": 37901.25
  },
  {
      "timestamp": 1651628834,
      "price": 37893.71
  },
  {
      "timestamp": 1651629134,
      "price": 37880.39
  },
  {
      "timestamp": 1651629434,
      "price": 37880.765
  },
  {
      "timestamp": 1651629734,
      "price": 37894.380000000005
  },
  {
      "timestamp": 1651630034,
      "price": 37918.880000000005
  },
  {
      "timestamp": 1651630334,
      "price": 37932.695
  },
  {
      "timestamp": 1651630634,
      "price": 37944.735
  },
  {
      "timestamp": 1651630934,
      "price": 37973.155
  },
  {
      "timestamp": 1651631234,
      "price": 37995.604999999996
  },
  {
      "timestamp": 1651631534,
      "price": 37995.45
  },
  {
      "timestamp": 1651631834,
      "price": 37981.130000000005
  },
  {
      "timestamp": 1651632134,
      "price": 37968.29
  }
];
const TOKEN1_RETURNS_EXAMPLE = [
  {
      "timestamp": 1651545734,
      "price": 2835.01
  },
  {
      "timestamp": 1651546034,
      "price": 2837.335
  },
  {
      "timestamp": 1651546334,
      "price": 2844.115
  },
  {
      "timestamp": 1651546634,
      "price": 2839.37
  },
  {
      "timestamp": 1651546934,
      "price": 2839.5150000000003
  },
  {
      "timestamp": 1651547234,
      "price": 2843.67
  },
  {
      "timestamp": 1651547534,
      "price": 2850.5
  },
  {
      "timestamp": 1651547834,
      "price": 2850.955
  },
  {
      "timestamp": 1651548134,
      "price": 2850.23
  },
  {
      "timestamp": 1651548434,
      "price": 2852.8
  },
  {
      "timestamp": 1651548734,
      "price": 2851.81
  },
  {
      "timestamp": 1651549034,
      "price": 2849.315
  },
  {
      "timestamp": 1651549334,
      "price": 2848.535
  },
  {
      "timestamp": 1651549634,
      "price": 2847.09
  },
  {
      "timestamp": 1651549934,
      "price": 2848.105
  },
  {
      "timestamp": 1651550234,
      "price": 2846.63
  },
  {
      "timestamp": 1651550534,
      "price": 2852.8
  },
  {
      "timestamp": 1651550834,
      "price": 2849.165
  },
  {
      "timestamp": 1651551134,
      "price": 2849.48
  },
  {
      "timestamp": 1651551434,
      "price": 2847.665
  },
  {
      "timestamp": 1651551734,
      "price": 2845.1000000000004
  },
  {
      "timestamp": 1651552034,
      "price": 2845.895
  },
  {
      "timestamp": 1651552334,
      "price": 2848.6949999999997
  },
  {
      "timestamp": 1651552634,
      "price": 2849.105
  },
  {
      "timestamp": 1651552934,
      "price": 2849.995
  },
  {
      "timestamp": 1651553234,
      "price": 2847.895
  },
  {
      "timestamp": 1651553534,
      "price": 2852.42
  },
  {
      "timestamp": 1651553834,
      "price": 2851.71
  },
  {
      "timestamp": 1651554134,
      "price": 2848.4750000000004
  },
  {
      "timestamp": 1651554434,
      "price": 2835.875
  },
  {
      "timestamp": 1651554734,
      "price": 2834.62
  },
  {
      "timestamp": 1651555034,
      "price": 2835.0950000000003
  },
  {
      "timestamp": 1651555334,
      "price": 2834.98
  },
  {
      "timestamp": 1651555634,
      "price": 2837.825
  },
  {
      "timestamp": 1651555934,
      "price": 2841.005
  },
  {
      "timestamp": 1651556234,
      "price": 2841.6800000000003
  },
  {
      "timestamp": 1651556534,
      "price": 2841.775
  },
  {
      "timestamp": 1651556834,
      "price": 2838.73
  },
  {
      "timestamp": 1651557134,
      "price": 2842.875
  },
  {
      "timestamp": 1651557434,
      "price": 2845.19
  },
  {
      "timestamp": 1651557734,
      "price": 2843.245
  },
  {
      "timestamp": 1651558034,
      "price": 2841.81
  },
  {
      "timestamp": 1651558334,
      "price": 2841.0
  },
  {
      "timestamp": 1651558634,
      "price": 2839.8149999999996
  },
  {
      "timestamp": 1651558934,
      "price": 2840.3599999999997
  },
  {
      "timestamp": 1651559234,
      "price": 2843.405
  },
  {
      "timestamp": 1651559534,
      "price": 2845.565
  },
  {
      "timestamp": 1651559834,
      "price": 2846.415
  },
  {
      "timestamp": 1651560134,
      "price": 2845.8050000000003
  },
  {
      "timestamp": 1651560434,
      "price": 2842.33
  },
  {
      "timestamp": 1651560734,
      "price": 2840.485
  },
  {
      "timestamp": 1651561034,
      "price": 2838.935
  },
  {
      "timestamp": 1651561334,
      "price": 2837.1800000000003
  },
  {
      "timestamp": 1651561634,
      "price": 2837.215
  },
  {
      "timestamp": 1651561934,
      "price": 2836.555
  },
  {
      "timestamp": 1651562234,
      "price": 2841.49
  },
  {
      "timestamp": 1651562534,
      "price": 2840.825
  },
  {
      "timestamp": 1651562834,
      "price": 2841.715
  },
  {
      "timestamp": 1651563134,
      "price": 2839.02
  },
  {
      "timestamp": 1651563434,
      "price": 2846.25
  },
  {
      "timestamp": 1651563734,
      "price": 2843.13
  },
  {
      "timestamp": 1651564034,
      "price": 2836.5600000000004
  },
  {
      "timestamp": 1651564334,
      "price": 2841.3599999999997
  },
  {
      "timestamp": 1651564634,
      "price": 2843.4849999999997
  },
  {
      "timestamp": 1651564934,
      "price": 2846.795
  },
  {
      "timestamp": 1651565234,
      "price": 2847.52
  },
  {
      "timestamp": 1651565534,
      "price": 2846.415
  },
  {
      "timestamp": 1651565834,
      "price": 2848.045
  },
  {
      "timestamp": 1651566134,
      "price": 2846.56
  },
  {
      "timestamp": 1651566434,
      "price": 2848.225
  },
  {
      "timestamp": 1651566734,
      "price": 2848.54
  },
  {
      "timestamp": 1651567034,
      "price": 2853.04
  },
  {
      "timestamp": 1651567334,
      "price": 2850.995
  },
  {
      "timestamp": 1651567634,
      "price": 2845.385
  },
  {
      "timestamp": 1651567934,
      "price": 2846.92
  },
  {
      "timestamp": 1651568234,
      "price": 2846.5
  },
  {
      "timestamp": 1651568534,
      "price": 2844.0950000000003
  },
  {
      "timestamp": 1651568834,
      "price": 2843.01
  },
  {
      "timestamp": 1651569134,
      "price": 2844.875
  },
  {
      "timestamp": 1651569434,
      "price": 2845.1549999999997
  },
  {
      "timestamp": 1651569734,
      "price": 2842.45
  },
  {
      "timestamp": 1651570034,
      "price": 2843.4300000000003
  },
  {
      "timestamp": 1651570334,
      "price": 2843.295
  },
  {
      "timestamp": 1651570634,
      "price": 2845.1400000000003
  },
  {
      "timestamp": 1651570934,
      "price": 2838.45
  },
  {
      "timestamp": 1651571234,
      "price": 2839.575
  },
  {
      "timestamp": 1651571534,
      "price": 2838.06
  },
  {
      "timestamp": 1651571834,
      "price": 2833.88
  },
  {
      "timestamp": 1651572134,
      "price": 2834.665
  },
  {
      "timestamp": 1651572434,
      "price": 2830.5299999999997
  },
  {
      "timestamp": 1651572734,
      "price": 2831.21
  },
  {
      "timestamp": 1651573034,
      "price": 2833.55
  },
  {
      "timestamp": 1651573334,
      "price": 2831.055
  },
  {
      "timestamp": 1651573634,
      "price": 2826.2749999999996
  },
  {
      "timestamp": 1651573934,
      "price": 2827.9849999999997
  },
  {
      "timestamp": 1651574234,
      "price": 2830.505
  },
  {
      "timestamp": 1651574534,
      "price": 2828.41
  },
  {
      "timestamp": 1651574834,
      "price": 2829.085
  },
  {
      "timestamp": 1651575134,
      "price": 2830.51
  },
  {
      "timestamp": 1651575434,
      "price": 2831.575
  },
  {
      "timestamp": 1651575734,
      "price": 2828.0
  },
  {
      "timestamp": 1651576034,
      "price": 2833.155
  },
  {
      "timestamp": 1651576334,
      "price": 2832.25
  },
  {
      "timestamp": 1651576634,
      "price": 2832.245
  },
  {
      "timestamp": 1651576934,
      "price": 2830.26
  },
  {
      "timestamp": 1651577234,
      "price": 2832.665
  },
  {
      "timestamp": 1651577534,
      "price": 2841.46
  },
  {
      "timestamp": 1651577834,
      "price": 2840.4350000000004
  },
  {
      "timestamp": 1651578134,
      "price": 2838.975
  },
  {
      "timestamp": 1651578434,
      "price": 2836.735
  },
  {
      "timestamp": 1651578734,
      "price": 2843.455
  },
  {
      "timestamp": 1651579034,
      "price": 2848.43
  },
  {
      "timestamp": 1651579334,
      "price": 2846.9849999999997
  },
  {
      "timestamp": 1651579634,
      "price": 2843.77
  },
  {
      "timestamp": 1651579934,
      "price": 2845.19
  },
  {
      "timestamp": 1651580234,
      "price": 2843.105
  },
  {
      "timestamp": 1651580534,
      "price": 2840.385
  },
  {
      "timestamp": 1651580834,
      "price": 2838.995
  },
  {
      "timestamp": 1651581134,
      "price": 2839.5649999999996
  },
  {
      "timestamp": 1651581434,
      "price": 2844.045
  },
  {
      "timestamp": 1651581734,
      "price": 2841.815
  },
  {
      "timestamp": 1651582034,
      "price": 2841.12
  },
  {
      "timestamp": 1651582334,
      "price": 2839.79
  },
  {
      "timestamp": 1651582634,
      "price": 2840.12
  },
  {
      "timestamp": 1651582934,
      "price": 2837.49
  },
  {
      "timestamp": 1651583234,
      "price": 2838.835
  },
  {
      "timestamp": 1651583534,
      "price": 2841.1
  },
  {
      "timestamp": 1651583834,
      "price": 2835.375
  },
  {
      "timestamp": 1651584134,
      "price": 2833.71
  },
  {
      "timestamp": 1651584434,
      "price": 2832.54
  },
  {
      "timestamp": 1651584734,
      "price": 2827.1099999999997
  },
  {
      "timestamp": 1651585034,
      "price": 2832.1
  },
  {
      "timestamp": 1651585334,
      "price": 2829.2250000000004
  },
  {
      "timestamp": 1651585634,
      "price": 2823.5550000000003
  },
  {
      "timestamp": 1651585934,
      "price": 2823.4750000000004
  },
  {
      "timestamp": 1651586234,
      "price": 2832.665
  },
  {
      "timestamp": 1651586534,
      "price": 2838.69
  },
  {
      "timestamp": 1651586834,
      "price": 2840.5550000000003
  },
  {
      "timestamp": 1651587134,
      "price": 2830.045
  },
  {
      "timestamp": 1651587434,
      "price": 2827.915
  },
  {
      "timestamp": 1651587734,
      "price": 2828.4300000000003
  },
  {
      "timestamp": 1651588034,
      "price": 2833.4449999999997
  },
  {
      "timestamp": 1651588334,
      "price": 2833.44
  },
  {
      "timestamp": 1651588634,
      "price": 2831.675
  },
  {
      "timestamp": 1651588934,
      "price": 2825.51
  },
  {
      "timestamp": 1651589234,
      "price": 2820.19
  },
  {
      "timestamp": 1651589534,
      "price": 2819.6099999999997
  },
  {
      "timestamp": 1651589834,
      "price": 2823.2349999999997
  },
  {
      "timestamp": 1651590134,
      "price": 2819.72
  },
  {
      "timestamp": 1651590434,
      "price": 2831.38
  },
  {
      "timestamp": 1651590734,
      "price": 2831.215
  },
  {
      "timestamp": 1651591034,
      "price": 2828.415
  },
  {
      "timestamp": 1651591334,
      "price": 2829.66
  },
  {
      "timestamp": 1651591634,
      "price": 2829.91
  },
  {
      "timestamp": 1651591934,
      "price": 2827.8450000000003
  },
  {
      "timestamp": 1651592234,
      "price": 2826.5299999999997
  },
  {
      "timestamp": 1651592534,
      "price": 2822.315
  },
  {
      "timestamp": 1651592834,
      "price": 2822.1099999999997
  },
  {
      "timestamp": 1651593134,
      "price": 2821.125
  },
  {
      "timestamp": 1651593434,
      "price": 2820.745
  },
  {
      "timestamp": 1651593734,
      "price": 2826.285
  },
  {
      "timestamp": 1651594034,
      "price": 2806.385
  },
  {
      "timestamp": 1651594334,
      "price": 2806.4700000000003
  },
  {
      "timestamp": 1651594634,
      "price": 2804.17
  },
  {
      "timestamp": 1651594934,
      "price": 2805.435
  },
  {
      "timestamp": 1651595234,
      "price": 2808.3
  },
  {
      "timestamp": 1651595534,
      "price": 2803.055
  },
  {
      "timestamp": 1651595834,
      "price": 2805.455
  },
  {
      "timestamp": 1651596134,
      "price": 2807.04
  },
  {
      "timestamp": 1651596434,
      "price": 2809.21
  },
  {
      "timestamp": 1651596734,
      "price": 2809.58
  },
  {
      "timestamp": 1651597034,
      "price": 2805.46
  },
  {
      "timestamp": 1651597334,
      "price": 2809.81
  },
  {
      "timestamp": 1651597634,
      "price": 2804.1549999999997
  },
  {
      "timestamp": 1651597934,
      "price": 2809.1949999999997
  },
  {
      "timestamp": 1651598234,
      "price": 2818.85
  },
  {
      "timestamp": 1651598534,
      "price": 2824.16
  },
  {
      "timestamp": 1651598834,
      "price": 2819.89
  },
  {
      "timestamp": 1651599134,
      "price": 2819.0950000000003
  },
  {
      "timestamp": 1651599434,
      "price": 2817.84
  },
  {
      "timestamp": 1651599734,
      "price": 2813.665
  },
  {
      "timestamp": 1651600034,
      "price": 2816.235
  },
  {
      "timestamp": 1651600334,
      "price": 2810.84
  },
  {
      "timestamp": 1651600634,
      "price": 2806.88
  },
  {
      "timestamp": 1651600934,
      "price": 2797.075
  },
  {
      "timestamp": 1651601234,
      "price": 2790.9449999999997
  },
  {
      "timestamp": 1651601534,
      "price": 2788.02
  },
  {
      "timestamp": 1651601834,
      "price": 2785.87
  },
  {
      "timestamp": 1651602134,
      "price": 2788.665
  },
  {
      "timestamp": 1651602434,
      "price": 2784.875
  },
  {
      "timestamp": 1651602734,
      "price": 2793.705
  },
  {
      "timestamp": 1651603034,
      "price": 2795.925
  },
  {
      "timestamp": 1651603334,
      "price": 2771.56
  },
  {
      "timestamp": 1651603634,
      "price": 2776.705
  },
  {
      "timestamp": 1651603934,
      "price": 2777.54
  },
  {
      "timestamp": 1651604234,
      "price": 2782.52
  },
  {
      "timestamp": 1651604534,
      "price": 2778.505
  },
  {
      "timestamp": 1651604834,
      "price": 2778.37
  },
  {
      "timestamp": 1651605134,
      "price": 2778.9049999999997
  },
  {
      "timestamp": 1651605434,
      "price": 2780.3999999999996
  },
  {
      "timestamp": 1651605734,
      "price": 2780.12
  },
  {
      "timestamp": 1651606034,
      "price": 2773.9
  },
  {
      "timestamp": 1651606334,
      "price": 2774.085
  },
  {
      "timestamp": 1651606634,
      "price": 2771.935
  },
  {
      "timestamp": 1651606934,
      "price": 2764.09
  },
  {
      "timestamp": 1651607234,
      "price": 2766.615
  },
  {
      "timestamp": 1651607534,
      "price": 2772.365
  },
  {
      "timestamp": 1651607834,
      "price": 2776.565
  },
  {
      "timestamp": 1651608134,
      "price": 2769.875
  },
  {
      "timestamp": 1651608434,
      "price": 2767.8599999999997
  },
  {
      "timestamp": 1651608734,
      "price": 2764.05
  },
  {
      "timestamp": 1651609034,
      "price": 2761.96
  },
  {
      "timestamp": 1651609334,
      "price": 2758.615
  },
  {
      "timestamp": 1651609634,
      "price": 2769.29
  },
  {
      "timestamp": 1651609934,
      "price": 2767.755
  },
  {
      "timestamp": 1651610234,
      "price": 2767.39
  },
  {
      "timestamp": 1651610534,
      "price": 2762.875
  },
  {
      "timestamp": 1651610834,
      "price": 2763.5299999999997
  },
  {
      "timestamp": 1651611134,
      "price": 2766.815
  },
  {
      "timestamp": 1651611434,
      "price": 2768.67
  },
  {
      "timestamp": 1651611734,
      "price": 2780.82
  },
  {
      "timestamp": 1651612034,
      "price": 2773.115
  },
  {
      "timestamp": 1651612334,
      "price": 2776.55
  },
  {
      "timestamp": 1651612634,
      "price": 2784.67
  },
  {
      "timestamp": 1651612934,
      "price": 2785.535
  },
  {
      "timestamp": 1651613234,
      "price": 2795.2799999999997
  },
  {
      "timestamp": 1651613534,
      "price": 2790.665
  },
  {
      "timestamp": 1651613834,
      "price": 2784.75
  },
  {
      "timestamp": 1651614134,
      "price": 2784.775
  },
  {
      "timestamp": 1651614434,
      "price": 2787.37
  },
  {
      "timestamp": 1651614734,
      "price": 2787.78
  },
  {
      "timestamp": 1651615034,
      "price": 2787.525
  },
  {
      "timestamp": 1651615334,
      "price": 2786.615
  },
  {
      "timestamp": 1651615634,
      "price": 2783.785
  },
  {
      "timestamp": 1651615934,
      "price": 2781.08
  },
  {
      "timestamp": 1651616234,
      "price": 2795.0299999999997
  },
  {
      "timestamp": 1651616534,
      "price": 2796.795
  },
  {
      "timestamp": 1651616834,
      "price": 2799.1899999999996
  },
  {
      "timestamp": 1651617134,
      "price": 2795.6899999999996
  },
  {
      "timestamp": 1651617434,
      "price": 2794.925
  },
  {
      "timestamp": 1651617734,
      "price": 2791.425
  },
  {
      "timestamp": 1651618034,
      "price": 2787.04
  },
  {
      "timestamp": 1651618334,
      "price": 2787.835
  },
  {
      "timestamp": 1651618634,
      "price": 2785.1850000000004
  },
  {
      "timestamp": 1651618934,
      "price": 2782.76
  },
  {
      "timestamp": 1651619234,
      "price": 2782.915
  },
  {
      "timestamp": 1651619534,
      "price": 2782.2799999999997
  },
  {
      "timestamp": 1651619834,
      "price": 2779.44
  },
  {
      "timestamp": 1651620134,
      "price": 2780.025
  },
  {
      "timestamp": 1651620434,
      "price": 2778.625
  },
  {
      "timestamp": 1651620734,
      "price": 2776.37
  },
  {
      "timestamp": 1651621034,
      "price": 2783.34
  },
  {
      "timestamp": 1651621334,
      "price": 2786.2799999999997
  },
  {
      "timestamp": 1651621634,
      "price": 2785.0150000000003
  },
  {
      "timestamp": 1651621934,
      "price": 2780.5550000000003
  },
  {
      "timestamp": 1651622234,
      "price": 2781.76
  },
  {
      "timestamp": 1651622534,
      "price": 2782.32
  },
  {
      "timestamp": 1651622834,
      "price": 2779.775
  },
  {
      "timestamp": 1651623134,
      "price": 2784.74
  },
  {
      "timestamp": 1651623434,
      "price": 2784.225
  },
  {
      "timestamp": 1651623734,
      "price": 2782.965
  },
  {
      "timestamp": 1651624034,
      "price": 2781.365
  },
  {
      "timestamp": 1651624334,
      "price": 2783.4799999999996
  },
  {
      "timestamp": 1651624634,
      "price": 2790.8900000000003
  },
  {
      "timestamp": 1651624934,
      "price": 2792.05
  },
  {
      "timestamp": 1651625234,
      "price": 2790.9449999999997
  },
  {
      "timestamp": 1651625534,
      "price": 2793.605
  },
  {
      "timestamp": 1651625834,
      "price": 2794.19
  },
  {
      "timestamp": 1651626134,
      "price": 2796.19
  },
  {
      "timestamp": 1651626434,
      "price": 2794.2
  },
  {
      "timestamp": 1651626734,
      "price": 2794.21
  },
  {
      "timestamp": 1651627034,
      "price": 2792.225
  },
  {
      "timestamp": 1651627334,
      "price": 2791.27
  },
  {
      "timestamp": 1651627634,
      "price": 2791.6800000000003
  },
  {
      "timestamp": 1651627934,
      "price": 2791.135
  },
  {
      "timestamp": 1651628234,
      "price": 2787.41
  },
  {
      "timestamp": 1651628534,
      "price": 2789.545
  },
  {
      "timestamp": 1651628834,
      "price": 2788.915
  },
  {
      "timestamp": 1651629134,
      "price": 2788.1000000000004
  },
  {
      "timestamp": 1651629434,
      "price": 2787.79
  },
  {
      "timestamp": 1651629734,
      "price": 2789.1099999999997
  },
  {
      "timestamp": 1651630034,
      "price": 2791.475
  },
  {
      "timestamp": 1651630334,
      "price": 2790.8599999999997
  },
  {
      "timestamp": 1651630634,
      "price": 2791.96
  },
  {
      "timestamp": 1651630934,
      "price": 2797.7799999999997
  },
  {
      "timestamp": 1651631234,
      "price": 2804.09
  },
  {
      "timestamp": 1651631534,
      "price": 2803.2650000000003
  },
  {
      "timestamp": 1651631834,
      "price": 2800.0249999999996
  },
  {
      "timestamp": 1651632134,
      "price": 2800
  }
];

const useExampleData = (
  from: Date,
  to: Date
) => {
  const returns = calculateReturns(POOL_RETURNS_EXAMPLE, TOKEN0_RETURNS_EXAMPLE, TOKEN1_RETURNS_EXAMPLE);

  const period = to.getTime() - from.getTime();
  const interval = period / returns.length;
  
  return returns.map((snapshot, i) => {
    return {
      'Total Returns': snapshot.pool - 1.0,
      'Uniswap V2': snapshot.sqrt - 1.0,
      '50/50 HODL': snapshot.fifty_fifty - 1.0,
      x: add(from, {seconds: interval * i}).toISOString(),
    };
  });
}

const generateData = (
  from: Date,
  to: Date,
  base1: number,
  base2: number,
  base3: number
) => {
  let difference = differenceInDays(to, from);
  let interval = {};
  if (difference <= 1) {
    interval = { minutes: 15 };
  } else if (difference <= 7) {
    interval = { hours: 3 };
  } else if (difference <= 31) {
    interval = { hours: 8 };
  } else if (difference <= 31 * 3) {
    interval = { days: 1 };
  } else if (difference <= 367) {
    interval = { weeks: 1 };
  } else {
    interval = { months: 1 };
  }
  let data = [];
  let currentDate = from;
  while (currentDate <= to) {
    base1 += Math.random() * 0.3 * Math.pow(-1, Math.ceil(Math.random() * 2));
    base2 += Math.random() * 0.3 * Math.pow(-1, Math.ceil(Math.random() * 2));
    base3 += Math.random() * 0.3 * Math.pow(-1, Math.ceil(Math.random() * 2));
    base1 = Math.abs(base1);
    base2 = Math.abs(base2);
    base3 = Math.abs(base3);
    data.push({
      'Total Returns': base1,
      'Uniswap V2': base2,
      '50/50 HODL': base3,
      x: currentDate.toISOString(),
    });
    currentDate = add(currentDate, interval);
  }
  return data;
};

const GraphButton = styled.button`
  ${tw`rounded-md w-10 p-1 bg-transparent disabled:text-grey-500`}
  color: ${GRAPH_BUTTON_TEXT_COLOR};
  &.active {
    background-color: ${GRAPH_BUTTON_ACTIVE_BG_COLOR};
    color: ${WHITE};

    /* For the nested Text component */
    div {
      color: ${WHITE};
    }
  }
  &:hover {
    background-color: ${GRAPH_BUTTON_ACTIVE_BG_COLOR};
    color: ${WHITE};

    /* For the nested Text component */
    div {
      color: ${WHITE};
    }
  }
`;

export type GraphButtonProps = {
  idx: number;
  text: string;
  active: boolean;
  handleClick: any;
};

const BlendAllocationGraphButton = (props: GraphButtonProps) => {
  return (
    <GraphButton
      key={props.idx}
      className={props.active ? 'active' : ''}
      onClick={props.handleClick}
    >
      <Text size='S' weight='medium' color={GRAPH_BUTTON_TEXT_COLOR}>{props.text}</Text>
    </GraphButton>
  );
};

const Wrapper = styled.div`
  ${tw`flex flex-row items-center justify-start`}
  position: relative;
  height: 372px;
  margin-bottom: 64px;
`;

const Container = styled.div`
  ${tw`flex flex-col items-center justify-start`}
  width: 100%;
`;

export type BlendAllocationGraphProps = {};

export default function BlendAllocationGraph(props: BlendAllocationGraphProps) {
  const [activeButton, setActiveButton] = useState(0);
  const now = new Date(Date.now());
  const [fromDate, setFromDate] = useState(subDays(now, 1));
  const [toDate, setToDate] = useState(now);

  const handleClick = (key: number) => {
    setActiveButton(key);
    let now = new Date(Date.now());
    switch (key) {
      case 0:
        setFromDate(subDays(now, 1));
        setToDate(now);
        break;
      case 1:
        setFromDate(subWeeks(now, 1));
        setToDate(now);
        break;
      case 2:
        setFromDate(subMonths(now, 1));
        setToDate(now);
        break;
      case 3:
        setFromDate(subMonths(now, 3));
        setToDate(now);
        break;
      case 4:
        setFromDate(subYears(now, 1));
        setToDate(now);
        break;
      case 5:
        setFromDate(subYears(now, 5));
        setToDate(now);
        break;
      default:
        break;
    }
  };

  const graphButtons: GraphButtonProps[] = [
    {
      idx: 0,
      text: '1D',
      active: true,
      handleClick: () => handleClick(0),
    },
    {
      idx: 1,
      text: '1W',
      active: false,
      handleClick: () => handleClick(1),
    },
    {
      idx: 2,
      text: '1M',
      active: false,
      handleClick: () => handleClick(2),
    },
    {
      idx: 3,
      text: '3M',
      active: false,
      handleClick: () => handleClick(3),
    },
    {
      idx: 4,
      text: '1Y',
      active: false,
      handleClick: () => handleClick(4),
    },
    {
      idx: 5,
      text: 'ALL',
      active: false,
      handleClick: () => handleClick(5),
    },
  ];

  // const data = generateData(fromDate, toDate, 6.5, 5, 4);
  const data = useExampleData(fromDate, toDate);
  console.log(data[0]);
  return (
    <Wrapper>
      <Container>
        <div className='w-full flex justify-end gap-4 pr-16 pb-16'>
          {graphButtons.map((props: any) => {
            props.active = props.idx === activeButton;
            return BlendAllocationGraphButton(props);
          })}
        </div>
        <BlendGraph data={data} fromDate={fromDate} toDate={toDate} />
      </Container>
    </Wrapper>
  );
}
