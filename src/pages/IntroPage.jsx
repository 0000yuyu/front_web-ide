export default function IntroPage() {
  return (
    <div className='flex items-start justify-stretch bg-oklch(98.5% 0 0)'>
      <div className='w-7 bg-gray-100' />
      <div className='flex-1 p-6 pt-0 min-h-screen justify-items-stretch'>
        {/* 소개 섹션 */}
        <div className='flex flex-col items-center text-xs text-indigo-500 py-6 space-y-2'>
          <p className='text-base font-semibold'>알고멘토</p>
          <p className='max-w-md text-center'>
            알고멘토는 코딩 스터디 플랫폼으로 사용자의 알고리즘 학습을
            지원해드립니다.
          </p>
          <a
            href='#'
            className='bg-[#A9B5DF] text-black hover:bg-[#8a96c6] px-4 py-2 rounded-md text-sm'
          >
            알고멘토 시작하기
          </a>
        </div>

        {/* 본문 */}
        <div className='p-6 space-y-6'>
          <section>
            <h2 className='text-lg font-semibold'>
              개인의 수준에 맞춘 학습 환경 제공
            </h2>
            <p className='mt-1 text-sm text-gray-700'>
              사용자의 실력을 객관적으로 판단할 수 있는 티어 시스템을 도입하여,
              비슷한 수준의 개발자들과 학습 그룹을 구성할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold'>주도적인 학습 문화 조성</h2>
            <p className='mt-1 text-sm text-gray-700'>
              누군가는 멘토가 되고, 누군가는 피드백을 받으며, 서로 가르치고
              배우는 경험을 통해 학습의 깊이를 더합니다.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold'>실시간 커뮤니티 지원</h2>
            <p className='mt-1 text-sm text-gray-700'>
              함께 과제를 해결하며 알고리즘 실력을 쌓도록 설계되었습니다.
            </p>
          </section>

          <section className='text-center mt-6'>
            <p className='text-base text-gray-800'>로그인하여 시작해보세요!</p>
          </section>
        </div>
      </div>
      <div className='w-7 bg-gray-100' />
    </div>
  );
}
