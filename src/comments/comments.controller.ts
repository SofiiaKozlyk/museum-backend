import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { plainToInstance } from 'class-transformer';
import { Comment } from './comment.entity';

@ApiTags('comments')
@Controller('api/exhibits/:exhibitId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new comment' })
    @ApiResponse({ status: 201, description: 'Comment successfully created' })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    async create(
        @Param('exhibitId') exhibitId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() req,
    ): Promise<Comment> {
        if (!createCommentDto.text) {
            throw new BadRequestException('Comment text is required');
        }

        if (!exhibitId) {
            throw new BadRequestException('Exhibit ID is required');
        }

        const comment = this.commentsService.createComment(createCommentDto, exhibitId, req.user.id);
        return plainToInstance(Comment, comment, { excludeExtraneousValues: true });
    }

    @Get()
    @ApiOperation({ summary: 'Get all comments for an exhibit' })
    @ApiResponse({ status: 200, description: 'List of comments' })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    async getComments(@Param('exhibitId', ParseIntPipe) exhibitId: number) {
        const comment = await this.commentsService.getCommentsByExhibitId(exhibitId);
        return plainToInstance(Comment, comment, { excludeExtraneousValues: true });
    }

    @Delete(':commentId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete a comment by ID' })
    @ApiResponse({ status: 200, description: 'Comment successfully deleted' })
    @ApiResponse({ status: 403, description: 'You are not the author of this comment' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    async deleteComment(
        @Param('commentId') commentId: number,
        @Req() req,
    ): Promise<{ message: string }> {
        await this.commentsService.deleteComment(commentId, req.user.id);
        return { message: 'Comment successfully deleted' };
    }
}
