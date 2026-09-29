import test from 'node:test';
import assert from 'node:assert/strict';
import { importMotionRecipes } from '../scripts/reference-runtime.mjs';
const { pointerUnit, damp, createPointerDriver, createVideoScrubber } = await importMotionRecipes();

test('pointer mapping uses its actual rectangle; damping retains equal-time response', () => {
  assert.deepEqual(pointerUnit(250, 180, { left: 150, top: 100, width: 200, height: 160 }), { x: .5, y: .5 });
  assert.deepEqual(pointerUnit(-10, 999, { left: 150, top: 100, width: 200, height: 160 }), { x: 0, y: 1 });
  assert.equal(pointerUnit(0, 0, { left: 0, top: 0, width: 0, height: 10 }), null);
  for (const hz of [30,60,120]) { let value = 0; for (let i=0;i<hz;i++) value=damp(value,1,14,1/hz); assert.ok(Math.abs(value-damp(0,1,14,1)) < 1e-12); }
  assert.throws(()=>damp(0,1,12,NaN));
});

test('pointer driver settles, handles cancel/preferences/touch, and cancels its one frame chain', () => {
  const surface = new EventTarget(), root = new EventTarget();
  surface.getBoundingClientRect=()=>({left:100,top:50,width:200,height:100});
  const frames = new Map(); let id=0, emissions=0;
  const driver=createPointerDriver(surface,()=>emissions++,{eventRoot:root,requestFrame:fn=>{frames.set(++id,fn);return id;},cancelFrame:id=>frames.delete(id)});
  const input=(type,x=300,y=150,pointerType='mouse')=>{const event=new Event(type);Object.assign(event,{clientX:x,clientY:y,pointerType});surface.dispatchEvent(event);};
  input('pointermove');input('pointermove');assert.equal(frames.size,1);
  for(let t=0;t<2000 && frames.size;t+=1000/60){ const [id,fn]=frames.entries().next().value;frames.delete(id);fn(t); }
  assert.equal(frames.size,0);assert.equal(driver.snapshot().x,1);assert.equal(driver.snapshot().y,1);
  input('pointercancel');assert.equal(driver.snapshot().x,.5);assert.equal(driver.snapshot().active,false);
  input('pointermove',100,50,'touch');assert.equal(frames.size,0);
  input('pointermove');driver.setEnabled(false);assert.equal(frames.size,0);input('pointermove');assert.equal(frames.size,0);
  driver.setEnabled(true);input('pointermove');driver.dispose();const before=emissions;input('pointermove');root.dispatchEvent(new Event('blur'));assert.equal(frames.size,0);assert.equal(emissions,before);
});

class Video extends EventTarget {
  duration=3;readyState=2;seeking=false;writes=[];position=0;paused=false;
  get currentTime(){return this.position;}
  set currentTime(value){assert.equal(this.seeking,false,'competing decoder seek');this.writes.push(value);this.seeking=true;this.pending=value;}
  pause(){this.paused=true;}
  finish(){this.position=this.pending;this.seeking=false;this.dispatchEvent(new Event('seeked'));}
}
function controller(video,options={}) {
  const timers=new Map();let next=0;const states=[];
  const scrub=createVideoScrubber(video,{onState:s=>states.push(s),scheduleTimeout:fn=>{timers.set(++next,fn);return next;},clearScheduled:id=>timers.delete(id),...options});
  return {scrub,timers,states};
}

test('video queue serializes seeks and converges to newest request including segment endpoints',()=>{
  const video=new Video();const {scrub,timers}=controller(video,{inTime:.4,outTime:2.2});
  scrub.setProgress(.9);scrub.setProgress(.1);scrub.setProgress(.8);scrub.setProgress(.2);
  assert.equal(video.writes.length,1);assert.equal(timers.size,1);
  video.finish();assert.equal(video.writes.length,2);video.finish();
  assert.ok(Math.abs(video.currentTime-.76)<1e-12);assert.equal(timers.size,0);assert.equal(scrub.snapshot().busy,false);
  scrub.setProgress(-5);video.finish();assert.equal(video.currentTime,.4);
  scrub.setProgress(9);video.finish();assert.equal(video.currentTime,2.2);
  const count=video.writes.length;scrub.setProgress(NaN);assert.equal(video.writes.length,count);scrub.dispose();
});

test('media waits for metadata, clamps the final frame, and bounds failure/retry/disposal',()=>{
  const video=new Video();video.duration=Infinity;video.readyState=0;
  const {scrub,timers,states}=controller(video);
  scrub.setProgress(1);assert.equal(video.writes.length,0);assert.equal(states.at(-1).phase,'waiting');
  video.duration=3;video.readyState=1;video.dispatchEvent(new Event('loadedmetadata'));
  assert.ok(video.writes[0]<3 && video.writes[0]>2.9);
  [...timers.values()][0]();assert.equal(scrub.snapshot().failed,true);
  video.finish();const count=video.writes.length;scrub.setProgress(.4);assert.equal(video.writes.length,count);
  scrub.retry();video.finish();assert.ok(Math.abs(video.currentTime-(3-1/30)*.4)<1e-12);
  scrub.setEnabled(false);scrub.setProgress(.8);assert.equal(timers.size,0);scrub.setEnabled(true);
  scrub.setProgress(.9);scrub.dispose();assert.equal(timers.size,0);const stateCount=states.length;video.finish();assert.equal(states.length,stateCount);
  assert.throws(()=>createVideoScrubber(video,{inTime:2,outTime:1}));
  const invalid=controller(video,{inTime:5});invalid.scrub.setProgress(.5);assert.equal(invalid.scrub.snapshot().failed,true);invalid.scrub.dispose();
  const earlyFailure=new Video();earlyFailure.error={code:2};
  const early=controller(earlyFailure);early.scrub.setEnabled(true);assert.equal(early.scrub.snapshot().failed,true);assert.equal(earlyFailure.writes.length,0);early.scrub.dispose();
});

test('media metadata wait has a deadline and a status callback can stop a pending seek', () => {
  const video = new Video(); video.duration = NaN; video.readyState = 0;
  const { scrub, timers } = controller(video);
  scrub.setProgress(.2); scrub.setProgress(.8);
  assert.equal(timers.size, 1, 'One bounded metadata wait; new targets do not extend it');
  [...timers.values()][0]();
  assert.equal(scrub.snapshot().failed, true);
  video.duration = 3; video.readyState = 2; video.dispatchEvent(new Event('loadedmetadata'));
  assert.equal(video.writes.length, 0, 'Late metadata must not silently restart failed work');
  scrub.retry(); video.finish();
  assert.ok(Math.abs(video.currentTime - (3 - 1 / 30) * .8) < 1e-12);
  scrub.dispose(); assert.equal(timers.size, 0);

  for (const stop of ['dispose', 'disable']) {
    const media = new Video(); let owner;
    const instance = controller(media, { onState: state => {
      if (state.phase === 'seeking') {
        if (stop === 'dispose') owner.dispose(); else owner.setEnabled(false);
      }
    } });
    owner = instance.scrub; owner.setProgress(.5);
    assert.equal(media.writes.length, 0, `${stop} during status notification prevents new work`);
    assert.equal(instance.timers.size, 0);
    owner.dispose();
  }
  for (const timeoutMs of [NaN, Infinity, 0, -1]) assert.throws(() => createVideoScrubber(new Video(), { timeoutMs }));
});
