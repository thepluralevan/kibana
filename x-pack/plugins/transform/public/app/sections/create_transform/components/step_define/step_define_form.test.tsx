/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Providers } from '../../../../app_dependencies.mock';
import {
  PivotAggsConfigDict,
  PivotGroupByConfigDict,
  PIVOT_SUPPORTED_AGGS,
  PIVOT_SUPPORTED_GROUP_BY_AGGS,
} from '../../../../common';
import { SearchItems } from '../../../../hooks/use_search_items';

import { StepDefineForm, getAggNameConflictToastMessages } from './step_define_form';

jest.mock('ui/new_platform');
jest.mock('../../../../../shared_imports');

describe('Transform: <DefinePivotForm />', () => {
  // Using the async/await wait()/done() pattern to avoid act() errors.
  test('Minimal initialization', async done => {
    // Arrange
    const searchItems = {
      indexPattern: {
        title: 'the-index-pattern-title',
        fields: [] as any[],
      } as SearchItems['indexPattern'],
    };
    const { getByLabelText } = render(
      <Providers>
        <StepDefineForm onChange={jest.fn()} searchItems={searchItems as SearchItems} />
      </Providers>
    );

    // Act
    // Assert
    expect(getByLabelText('Index pattern')).toBeInTheDocument();
    await wait();
    done();
  });
});

describe('Transform: isAggNameConflict()', () => {
  test('detect aggregation name conflicts', () => {
    const aggList: PivotAggsConfigDict = {
      'the-agg-name': {
        agg: PIVOT_SUPPORTED_AGGS.AVG,
        field: 'the-field-name',
        aggName: 'the-agg-name',
        dropDownName: 'the-dropdown-name',
      },
      'the-namespaced-agg-name.namespace': {
        agg: PIVOT_SUPPORTED_AGGS.AVG,
        field: 'the-field-name',
        aggName: 'the-namespaced-agg-name.namespace',
        dropDownName: 'the-dropdown-name',
      },
    };

    const groupByList: PivotGroupByConfigDict = {
      'the-group-by-agg-name': {
        agg: PIVOT_SUPPORTED_GROUP_BY_AGGS.TERMS,
        field: 'the-field-name',
        aggName: 'the-group-by-agg-name',
        dropDownName: 'the-dropdown-name',
      },
      'the-namespaced-group-by-agg-name.namespace': {
        agg: PIVOT_SUPPORTED_GROUP_BY_AGGS.TERMS,
        field: 'the-field-name',
        aggName: 'the-namespaced-group-by-agg-name.namespace',
        dropDownName: 'the-dropdown-name',
      },
    };

    // no conflict, completely different name, no namespacing involved
    expect(
      getAggNameConflictToastMessages('the-other-agg-name', aggList, groupByList)
    ).toHaveLength(0);
    // no conflict, completely different name and no conflicting namespace
    expect(
      getAggNameConflictToastMessages('the-other-agg-name.namespace', aggList, groupByList)
    ).toHaveLength(0);

    // exact match conflict on aggregation name
    expect(getAggNameConflictToastMessages('the-agg-name', aggList, groupByList)).toStrictEqual([
      `An aggregation configuration with the name 'the-agg-name' already exists.`,
    ]);
    // namespace conflict with `the-agg-name` aggregation
    expect(
      getAggNameConflictToastMessages('the-agg-name.namespace', aggList, groupByList)
    ).toStrictEqual([
      `Couldn't add configuration 'the-agg-name.namespace' because of a nesting conflict with 'the-agg-name'.`,
    ]);

    // exact match conflict on group-by name
    expect(
      getAggNameConflictToastMessages('the-group-by-agg-name', aggList, groupByList)
    ).toStrictEqual([
      `A group by configuration with the name 'the-group-by-agg-name' already exists.`,
    ]);
    // namespace conflict with `the-group-by-agg-name` group-by
    expect(
      getAggNameConflictToastMessages('the-group-by-agg-name.namespace', aggList, groupByList)
    ).toStrictEqual([
      `Couldn't add configuration 'the-group-by-agg-name.namespace' because of a nesting conflict with 'the-group-by-agg-name'.`,
    ]);

    // exact match conflict on namespaced agg name
    expect(
      getAggNameConflictToastMessages('the-namespaced-agg-name.namespace', aggList, groupByList)
    ).toStrictEqual([
      `An aggregation configuration with the name 'the-namespaced-agg-name.namespace' already exists.`,
    ]);
    // no conflict, same base agg name but different namespace
    expect(
      getAggNameConflictToastMessages('the-namespaced-agg-name.namespace2', aggList, groupByList)
    ).toHaveLength(0);
    // namespace conflict because the new agg name is base name of existing nested field
    expect(
      getAggNameConflictToastMessages('the-namespaced-agg-name', aggList, groupByList)
    ).toStrictEqual([
      `Couldn't add configuration 'the-namespaced-agg-name' because of a nesting conflict with 'the-namespaced-agg-name.namespace'.`,
    ]);

    // exact match conflict on namespaced group-by name
    expect(
      getAggNameConflictToastMessages(
        'the-namespaced-group-by-agg-name.namespace',
        aggList,
        groupByList
      )
    ).toStrictEqual([
      `A group by configuration with the name 'the-namespaced-group-by-agg-name.namespace' already exists.`,
    ]);
    // no conflict, same base group-by name but different namespace
    expect(
      getAggNameConflictToastMessages(
        'the-namespaced-group-by-agg-name.namespace2',
        aggList,
        groupByList
      )
    ).toHaveLength(0);
    // namespace conflict because the new group-by name is base name of existing nested field
    expect(
      getAggNameConflictToastMessages('the-namespaced-group-by-agg-name', aggList, groupByList)
    ).toStrictEqual([
      `Couldn't add configuration 'the-namespaced-group-by-agg-name' because of a nesting conflict with 'the-namespaced-group-by-agg-name.namespace'.`,
    ]);
  });
});