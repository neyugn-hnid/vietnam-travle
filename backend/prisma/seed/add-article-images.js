const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Adding article images...\n');
  
  // Get existing articles
  const articles = await prisma.article.findMany({ take: 5 });
  
  if (articles.length === 0) {
    console.log('No articles found. Please run seed first.');
    return;
  }
  
  // Define article images for first 5 articles
  const articleImages = [
    // Article 1 - Top 10 destinations
    { articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', caption: 'Vịnh Hạ Long - Kỳ quan thiên nhiên', isPrimary: true, sortOrder: 0 },
    { articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?w=800', caption: 'Du thuyền trên vịnh', isPrimary: false, sortOrder: 1 },
    { articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800', caption: 'Hang động Hạ Long', isPrimary: false, sortOrder: 2 },
    { articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', caption: 'Phong cảnh Việt Nam', isPrimary: false, sortOrder: 3 },
    
    // Article 2 - Hội An guide
    { articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800', caption: 'Phố cổ Hội An', isPrimary: true, sortOrder: 0 },
    { articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1597932578892-416ec6f15a1c?w=800', caption: 'Đèn lồng Hội An', isPrimary: false, sortOrder: 1 },
    { articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', caption: 'Ẩm thực Hội An', isPrimary: false, sortOrder: 2 },
    
    // Article 3 - Saving tips
    { articleId: articles[2].id, url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', caption: 'Du lịch Việt Nam', isPrimary: true, sortOrder: 0 },
    { articleId: articles[2].id, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Bãi biển đẹp', isPrimary: false, sortOrder: 1 },
    
    // Article 4 - Hanoi food
    { articleId: articles[3].id, url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800', caption: 'Phở Hà Nội', isPrimary: true, sortOrder: 0 },
    { articleId: articles[3].id, url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', caption: 'Bún chả Hà Nội', isPrimary: false, sortOrder: 1 },
    { articleId: articles[3].id, url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800', caption: 'Cà phê trứng', isPrimary: false, sortOrder: 2 },
    
    // Article 5 - Da Lat flower season
    { articleId: articles[4].id, url: 'https://images.unsplash.com/photo-1597932578892-416ec6f15a1c?w=800', caption: 'Đà Lạt mùa hoa', isPrimary: true, sortOrder: 0 },
    { articleId: articles[4].id, url: 'https://images.unsplash.com/photo-1583163090260-8e62b645f7f5?w=800', caption: 'Hoa dã quỳ', isPrimary: false, sortOrder: 1 },
  ];
  
  let addedCount = 0;
  
  for (const img of articleImages) {
    try {
      // Check if image already exists
      const existing = await prisma.articleImage.findFirst({
        where: { articleId: img.articleId, url: img.url }
      });
      
      if (!existing) {
        await prisma.articleImage.create({
          data: {
            id: uuidv4(),
            ...img
          }
        });
        addedCount++;
      }
    } catch (error) {
      // Ignore duplicates
    }
  }
  
  console.log(`✓ Added ${addedCount} article images`);
  console.log('\n✅ Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
