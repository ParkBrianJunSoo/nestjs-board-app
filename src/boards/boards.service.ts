import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus} from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository
        ) {};

    // private boards: Board[] = []; // private을 사용하지 않으면 다른 곳에서 배열 수정 가능

    // getAllBoards(): Board[] {
    //     return this.boards;
    // }

    async getAllBoards(
        user: User
    ): Promise <Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        query.where('board.userId = :userId', { userId: user.id});

        const boards = await query.getMany();
        return this.boardRepository.find();
    }

    // // createBoard(title: string, description: string){
    // //     const board: Board = {
    // //         id: uuid(),
    // //         title,
    // //         description,
    // //         status: BoardStatus.PUBLIC
    // //     }
    // //     this.boards.push(board);
    // //     return board;
    // // }

    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOne(id);
    
        if (!found) {
            throw new NotFoundException(`해당 ID(${id})에 해당하는 게시물을 찾을 수 없습니다`);
        }
    
        return found;
    }
    
    // createBoard(createBoardDto: CreateBoardDto){ // dto 용
    //     const { title, description } = createBoardDto;

    //     const board: Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }
    //     this.boards.push(board);
    //     return board;
    // } 

    createBoard(createBoardDto: CreateBoardDto, user: User) : Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto, user);
    }

    // getBoardById(id: string): Board { 
    //     const found = this.boards.find((board) => board.id === id);
        
    //     if(!found){
    //         throw new NotFoundException(`Can't find board with id ${id}`);
    //     }
    //     return found;
    // }

    // deleteBoard(id:string):void {
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== found.id);
    // }

    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository.delete({id, user});

        if(result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
    }

    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }
}
