<script lang="ts">
  import Interactive1 from './components/Interactive1.svelte'
  import Interactive2 from './components/Interactive2.svelte'
  import Interactive3 from './components/Interactive3.svelte'
  import Interactive4 from './components/Interactive4.svelte'
  import Interactive5 from './components/Interactive5.svelte'
  import Interactive6 from './components/Interactive6.svelte'
  import Interactive7 from './components/Interactive7.svelte'
  import Interactive8 from './components/Interactive8.svelte'
  import Interactive9 from './components/Interactive9.svelte'
  import Table from './components/Table.svelte'
  import H2 from './components/H2.svelte'
  import { rem } from './constants'
</script>

<svelte:head>
  <title>GraphQL Adoption</title>
</svelte:head>

<header class="mt-32 mb-16">
  <h1 class="max-w-xl mx-auto text-5xl">GraphQL Adoption</h1>
</header>

<main class="my-16 space-y-12">
  <section class="max-w-xl mx-auto space-y-4">
    <H2>背景</H2>

    <p>
      先来看一个很普通的班主任学生列表，会展示学生的「姓名」和「地区」信息：
    </p>

    <div>
      <div class="my-12">
        <Table
          head={['ID', '姓名', '地区']}
          body={[
            ['1', '小明', '北京'],
            ['2', 'Jane Doe', 'Ape City'],
          ]}
        />
      </div>
    </div>

    <p>通常情况下，对应接口的实现逻辑包括：</p>

    <ol class="pl-8 list-decimal">
      <li>取到该班主任的学生 ID 列表；</li>
      <li>用学生 ID 获取对应的用户信息；</li>
      <li>将数据拼装成接口需要的结构并返回。</li>
    </ol>
  </section>

  <section class="max-w-6xl mx-auto space-y-4 text-gray-400">
    <Interactive1 />
  </section>

  <section class="max-w-xl mx-auto space-y-4">
    <p>这是另一个学生列表，用来帮助班主任了解学生的设备使用情况：</p>

    <div>
      <div class="my-12">
        <Table
          head={['ID', '姓名', '设备']}
          body={[
            ['1', '小明', 'macOS'],
            ['2', 'Jane Doe', 'Windows 10'],
          ]}
        />
      </div>
    </div>

    <p>
      这两个列表的区别是否包含「地区」和「设备」字段。我们当然可以为这个列表写一个新的接口，但这种实现方式会产生逻辑上的重复，尤其是当重复的字段较多时，不利于后续维护。
    </p>

    <p>
      因此在实际工作中，一般会选择在前一个接口上增加字段的实现方式，使两个列表复用同一个接口。
    </p>
  </section>

  <section class="max-w-6xl mx-auto space-y-4 text-gray-400">
    <Interactive2 />
  </section>

  <section class="max-w-xl mx-auto space-y-4">
    <p>
      由此产生的问题是，随着接口结构字段的增多，需要从更多的数据源获取对应数据，导致性能上的损失。例如对于第一个列表来说，即使不需要「设备」字段，也需要消耗查询数据的时间。
    </p>

    <p>
      除了性能影响以外，依赖的增多还会导致接口可用性的指数级下降，任意数据源出现故障都会使接口调用失败。
    </p>

    <H2>实际问题</H2>

    <p>
      猿编程班主任工作台 Qwerty
      的班课详情页是班主任常用的数据看板之一。这个页面可以简单理解为有多个字段的学生列表，班主任会根据自己的需要选择其中的一部分进行展示。
    </p>
  </section>

  <section class="max-w-2xl mx-auto space-y-4">
    <Interactive3 />
  </section>

  <section class="max-w-xl mx-auto space-y-4">
    <p>
      在实际页面中，班主任能够控制的字段数量超过 60
      个，但在一般情况下的关注范围会在 10
      个以内。在字段数量还比较少的早期阶段，我们选择了最简单的实现方式，即后端接口返回全部字段，在前端对不需要的字段进行隐藏。然而随着字段数量的增多，接口性能问题逐渐暴露，从页面上能明显感知到数据加载缓慢。
    </p>

    <p>于是我们对接口实现的各部分性能进行了分析，统计结果如下：</p>
  </section>

  <section class="max-w-6xl mx-auto space-y-4">
    <Interactive4 />
  </section>

  <section class="max-w-xl mx-auto space-y-4">
    <p>
      图表中最明显的<svg
        class="inline-block"
        width={1.5 * rem}
        height={1.5 * rem}
      >
        <rect
          x={0.35 * rem}
          y={0.3 * rem}
          width={0.8 * rem}
          height={0.8 * rem}
          fill="#66c2a4"
        />
      </svg>部分，占用总耗时超过一半，对应学生的「订单」和「优惠券」数据查询过程。也就是说，无论班主任选择的是
      60
      个字段中的哪一种组合，都必须把一半甚至更多的查询时间用在这两个字段上，即使最终会被丢掉。显然这是前面提到问题的一个极端情况。
    </p>

    <p>
      因此我们的主要优化方向十分明确，目标是按需要执行数据查询等逻辑，以减少性能开销。
    </p>

    <H2>GraphQL 能做什么</H2>

    <p>
      <a
        target="_blank"
        href="https://graphql.org/"
        class="text-gray-400 underline">GraphQL</a
      >
      是一种接口协议或模式，核心是描述数据之间关系。
    </p>

    <p>
      仍以最初的学生列表为例。列表的入口是和班主任有关联关系的学生数据项，每一项都包含了
      userId 属性。这类结构和自身属之间的关系就是最基本的数据关系。
    </p>

    <div class="py-4">
      <Interactive5 />
    </div>

    <p>
      除了固有属性外，还能（通过 userId
      属性）建立列表项和用户个人信息（不包含其属性）之间的关系。不同数据项之间的关系是另一种数据关系。
    </p>

    <div class="py-4">
      <Interactive6 />
    </div>

    <p>
      以此类推，用户个人信息能和其属性用户「姓名」、「地区」建立关系；列表项和设备信息，设备信息和「设备名称」之间也能关联起来。
    </p>

    <div class="py-4">
      <Interactive7 />
    </div>

    <p>
      定义数据之间的关系几乎就是使用 GraphQL
      的全部工作了。当收到调用请求时，GraphQL
      会分析其需要的数据结构，根据数据关系进行必要查询，动态拼装所需的结果。
    </p>
    <p>
      对于上边的学生列表，除了直接属性「ID」外，当我们不需要显示「姓名」、「地区」或「设备」字段时，GraphQL
      能够尽可能进行最少的数据查询。
    </p>
  </section>

  <section class="max-w-6xl mx-auto space-y-4">
    <Interactive8 />
  </section>

  <section class="max-w-xl mx-auto space-y-4">
    <H2>应用</H2>

    <p>
      在 Qwerty 班课详情页的场景中，GraphQL
      不仅能够解决对学生「订单」和「优惠券」等字段按需填充的问题，还能减少从底层数据源读取的字段数量，从而减少数据传输以及数据序列化消耗的时间。
    </p>

    <p>
      经过前后端重构之后，能看到 GraphQL
      的应用基本达到了预期的效果。从页面上看，班课详情页数据能够和其他信息同时显示，不再有明显的迟滞感；统计数据方面，3
      月 21 日的接口执行时间环比减少了 60% 以上。
    </p>
  </section>

  <section class="max-w-6xl mx-auto space-y-4">
    <Interactive9 />
  </section>

  <section class="max-w-xl mx-auto space-y-4">
    <p>
      值得一提的是，对于相互独立的数据，理论上可以并发执行查询过程。但在以往的实现方式中，由于编程语言、环境等因素的限制，一般会忽略这个优化点。而
      GraphQL
      会通过判断数据之间的依赖关系，自动进行并发处理。因此即使在班主任选择展示全部字段，GraphQL
      依然会有一定的性能优势。
    </p>

    <H2>后记</H2>

    <p>
      在本次 GraphQL
      应用中，主要用到的是其动态执行逻辑和拼装数据结构的功能，但这只是 GraphQL
      的一部分功能。就个人角度来说，GraphQL 最吸引人的点在于对开发体验的优化。
    </p>

    <p>
      例如，GraphQL Schema
      有完备的类型系统，精确地定义能减少不必要的麻烦。对于后端来说，可以一次性地完成接口定义、类型检查、文档描述的工作，比现行的
      Spring Validation、Swagger 方式更完善、流畅；从前端角度看，GraphQL
      相关生态更加完善，至少可以直接<a
        target="_blank"
        href="https://www.graphql-code-generator.com/"
        class="text-gray-400 underline">生成</a
      >完整的接口 TypeScript 类型，大概能够在一定程度上会提高代码质量。
    </p>

    <p>
      另外，GraphQL
      的数据关系可以是网状的（Graph），这意味者后续添加到网络中的的数据节点能够立即关联到其他数据，极大程度地复用已有逻辑。
    </p>

    <p>……</p>

    <p>总之，希望 GraphQL 能早日普及！</p>
  </section>
</main>

<footer class="mt-64 mb-16">
  <div
    class="max-w-xl mx-auto text-sm text-gray-400 flex justify-center space-x-4"
  >
    <a
      target="_blank"
      href="https://confluence.zhenguanyu.com/display/~zhuxx01/GraphQL+Adoption"
    >
      Confluence
    </a>
    <a
      target="_blank"
      href="https://discourse.zhenguanyu.com/t/topic/638?u=zhuxx01"
    >
      Discourse
    </a>
    <a target="_blank" href="https://github.com/anotherzxx/graphql-adoption">
      GitHub
    </a>
  </div>
</footer>
