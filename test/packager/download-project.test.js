import './polyfill';
import fs from 'fs';
import path from 'path';
import {downloadProject} from '../../src/packager/download-project'

const readTestProject = (name) => {
  const buffer = fs.readFileSync(path.resolve(__dirname, 'projects', name));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
};

test('sb3', async () => {
  const project = await downloadProject(readTestProject('no-music.sb3'), () => {});
  expect(project.type).toBe('sb3');
  expect(project.analysis.stageVariables).toEqual([
    {
      name: 'my variable',
      isCloud: false
    },
    {
      name: '☁ Cloud variable',
      isCloud: true
    }
  ]);
  expect(project.analysis.usesMusic).toBe(false);
});

test('sb3 with music', async () => {
  const project = await downloadProject(readTestProject('music.sb3'), () => {});
  expect(project.analysis.usesMusic).toBe(true);
});

test('sb2', async () => {
  const project = await downloadProject(readTestProject('no-music.sb2'), () => {});
  expect(project.blob.size).toBe(6259);
  expect(project.type).toBe('blob');
  expect(project.analysis.usesMusic).toBe(false);
  expect(project.analysis.stageVariables).toEqual([
    {
      name: '☁ Variable',
      isCloud: true
    },
    {
      name: 'Variable 2',
      isCloud: false
    }
  ]);
});

test('sb2 with music', async () => {
  const project = await downloadProject(readTestProject('music.sb2'), () => {});
  expect(project.blob.size).toBe(6293);
  expect(project.type).toBe('blob');
  expect(project.analysis.usesMusic).toBe(true);
});

test('sb', async () => {
  const project = await downloadProject(readTestProject('project.sb'), () => {});
  expect(project.blob.size).toBe(554);
  expect(project.type).toBe('blob');
});

test('subdirectory', async () => {
  const project = await downloadProject(readTestProject('subdirectory.sb3'), () => {});
  expect(project.type).toBe('sb3');
});

test('invalid project', async () => {
  try {
    await downloadProject(readTestProject('invalid.txt'), () => {});
  } catch (e) {
    return;
  }
  throw new Error('Expected error, got success');
});
